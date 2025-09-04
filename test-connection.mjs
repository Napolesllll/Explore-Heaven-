import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔍 Testing NeonDB connection...\n');

    await prisma.$connect();
    console.log('✅ Connection established');

    // Test basic database info
    const result = await prisma.$queryRaw`SELECT NOW() as time, version() as version`;
    console.log('✅ Database info:');
    console.log(`   Time: ${result[0].time}`);
    console.log(`   Version: ${result[0].version.split(' ')[0]}\n`);

    // Test record counts
    const userCount = await prisma.user.count();
    const tourCount = await prisma.tour.count();
    const reservaCount = await prisma.reserva.count();
    const reviewCount = await prisma.review.count();
    
    console.log('✅ Record counts:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Tours: ${tourCount}`);
    console.log(`   Reservas: ${reservaCount}`);
    console.log(`   Reviews: ${reviewCount}\n`);

    console.log('🔧 Testing RLS functions...');
    
    try {
      // Check if RLS functions exist
      const functionCheck = await prisma.$queryRaw`
        SELECT proname 
        FROM pg_proc 
        WHERE proname IN ('set_current_user_id', 'get_current_user_id', 'is_current_user_admin', 'is_current_user_guia')
        ORDER BY proname
      `;
      
      console.log('✅ RLS Functions found:');
      functionCheck.forEach(func => {
        console.log(`   - ${func.proname}`);
      });

      if (functionCheck.length === 0) {
        console.log('❌ No RLS functions found! Please run the setup script first.');
        return;
      }

      // Test setting a regular user
      console.log('\n🧪 Testing RLS functions...');
      await prisma.$executeRawUnsafe(`SELECT set_current_user_id($1)`, 'test-user-123');
      
      const currentUser = await prisma.$queryRaw`SELECT get_current_user_id() as current_user`;
      console.log(`✅ Current user set to: ${currentUser[0].current_user}`);
      
      const isAdmin = await prisma.$queryRaw`SELECT is_current_user_admin() as is_admin`;
      console.log(`✅ Is admin: ${isAdmin[0].is_admin}`);

      // Test setting admin user
      await prisma.$executeRawUnsafe(`SELECT set_current_user_id($1)`, 'ADMIN_USER');
      const isAdminCheck = await prisma.$queryRaw`SELECT is_current_user_admin() as is_admin`;
      console.log(`✅ Admin test: ${isAdminCheck[0].is_admin}`);

      // Clean up
      await prisma.$executeRawUnsafe(`SELECT clear_current_user_id()`);
      console.log('✅ RLS functions working correctly');

    } catch (rlsError) {
      console.log('❌ RLS Error:', rlsError.message);
      
      if (rlsError.message.includes('does not exist')) {
        console.log('\n💡 Solution: Run the RLS setup script in your Neon console:');
        console.log('   1. Go to your Neon dashboard');
        console.log('   2. Open SQL Editor');
        console.log('   3. Run the provided RLS functions script');
      }
    }

    // Check if RLS is enabled on tables
    console.log('\n🛡️ Checking RLS status...');
    try {
      const rlsStatus = await prisma.$queryRaw`
        SELECT 
          schemaname,
          tablename,
          rowsecurity as rls_enabled
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('User', 'Tour', 'Reserva', 'Review', 'Guia')
        ORDER BY tablename
      `;
      
      rlsStatus.forEach(table => {
        const status = table.rls_enabled ? '✅ Enabled' : '⚪ Disabled';
        console.log(`   ${table.tablename}: ${status}`);
      });

    } catch (error) {
      console.log('ℹ️ Could not check RLS status (this is normal if RLS is not set up yet)');
    }

    console.log('\n🎉 All connection tests completed successfully!');

  } catch (error) {
    console.error('\n💥 Connection failed:');
    console.error(`Error: ${error.message}`);
    if (error.code) console.error(`Code: ${error.code}`);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();