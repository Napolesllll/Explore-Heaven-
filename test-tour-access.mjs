import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testTourAccess() {
  try {
    console.log('🔍 Testing Tour Access with RLS...\n');

    await prisma.$connect();

    // 1. Verificar políticas existentes en Tour
    console.log('📋 Checking Tour policies...');
    try {
      const tourPolicies = await prisma.$queryRaw`
        SELECT 
          policyname,
          cmd,
          permissive,
          qual,
          with_check
        FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'Tour'
        ORDER BY policyname
      `;
      
      console.log(`✅ Found ${tourPolicies.length} policies for Tour table:`);
      tourPolicies.forEach(policy => {
        console.log(`   - ${policy.policyname} (${policy.cmd})`);
      });

      if (tourPolicies.length === 0) {
        console.log('❌ NO POLICIES FOUND! This is the problem.');
        console.log('💡 You need to run the tour policy script first.\n');
      }

    } catch (error) {
      console.log('❌ Error checking policies:', error.message);
    }

    // 2. Test Tour access without setting user (public access)
    console.log('\n🌍 Testing PUBLIC access to tours...');
    try {
      // Clear any user context (simulate public/unauthenticated access)
      await prisma.$executeRawUnsafe(`SELECT clear_current_user_id()`);
      
      // Try to fetch tours (this should work if policies are correct)
      const tours = await prisma.tour.findMany({
        select: {
          id: true,
          nombre: true,
          descripcion: true,
          precio: true
        }
      });

      console.log(`✅ PUBLIC ACCESS: Found ${tours.length} tours`);
      tours.forEach(tour => {
        console.log(`   - ${tour.nombre} (${tour.precio})`);
      });

      if (tours.length === 0) {
        console.log('⚠️  No tours returned - could be RLS blocking or no tours in DB');
      }

    } catch (error) {
      console.log('❌ PUBLIC ACCESS FAILED:', error.message);
      console.log('💡 This means RLS is blocking public access to tours');
    }

    // 3. Test specific tour access (like tour details page)
    console.log('\n🎯 Testing SPECIFIC tour access...');
    try {
      // Get the first tour ID
      const firstTour = await prisma.$queryRaw`
        SELECT id FROM "Tour" 
        ORDER BY "createdAt" 
        LIMIT 1
      `;

      if (firstTour.length > 0) {
        const tourId = firstTour[0].id;
        console.log(`🔍 Testing access to tour: ${tourId}`);

        const tourDetails = await prisma.tour.findUnique({
          where: { id: tourId },
          select: {
            id: true,
            nombre: true,
            descripcion: true,
            precio: true,
            ubicacion: true
          }
        });

        if (tourDetails) {
          console.log('✅ SPECIFIC TOUR ACCESS: Success');
          console.log(`   Tour: ${tourDetails.nombre}`);
          console.log(`   Price: ${tourDetails.precio}`);
        } else {
          console.log('❌ SPECIFIC TOUR ACCESS: Failed - returned null');
          console.log('💡 This is exactly what your app is experiencing!');
        }
      } else {
        console.log('⚠️  No tours found in database');
      }

    } catch (error) {
      console.log('❌ SPECIFIC TOUR ACCESS ERROR:', error.message);
    }

    // 4. Test admin access
    console.log('\n👑 Testing ADMIN access...');
    try {
      await prisma.$executeRawUnsafe(`SELECT set_current_user_id('ADMIN_USER')`);
      
      const adminTours = await prisma.tour.findMany({
        select: { id: true, nombre: true }
      });

      console.log(`✅ ADMIN ACCESS: Found ${adminTours.length} tours`);
      
    } catch (error) {
      console.log('❌ ADMIN ACCESS FAILED:', error.message);
    }

    // 5. Provide solution if needed
    console.log('\n🔧 DIAGNOSIS:');
    
    const policies = await prisma.$queryRaw`
      SELECT COUNT(*) as count
      FROM pg_policies 
      WHERE schemaname = 'public' 
      AND tablename = 'Tour'
    `;

    if (policies[0].count === 0) {
      console.log('❌ PROBLEM: No policies found for Tour table');
      console.log('💡 SOLUTION: Run this SQL in your Neon console:');
      console.log('');
      console.log('CREATE POLICY "tours_public_select" ON "Tour"');
      console.log('    FOR SELECT USING (true);');
      console.log('');
      console.log('CREATE POLICY "tours_admin_modify" ON "Tour"');
      console.log('    FOR ALL USING (is_current_user_admin())');
      console.log('    WITH CHECK (is_current_user_admin());');
    } else {
      console.log(`✅ Found ${policies[0].count} policies for Tour table`);
    }

  } catch (error) {
    console.error('\n💥 Test failed:', error.message);
  } finally {
    // Clean up
    try {
      await prisma.$executeRawUnsafe(`SELECT clear_current_user_id()`);
    } catch (e) {}
    await prisma.$disconnect();
  }
}

testTourAccess();