
const bcrypt = require('bcryptjs');

async function generateHashForEnv(password) {
    try {
        const saltRounds = 12;
        const hash = await bcrypt.hash(password, saltRounds);
        
        console.log('✅ Hash generado:', hash);
        console.log('✅ Longitud:', hash.length);
        console.log('✅ Formato válido:', hash.startsWith('$2a$') || hash.startsWith('$2b$'));
        
        // Verificar que funciona
        const isValid = await bcrypt.compare(password, hash);
        console.log('✅ Verificación:', isValid);
        
        console.log('\n🔧 OPCIONES PARA TU ARCHIVO .env:\n');
        
        console.log('Opción 1 - Sin comillas:');
        console.log(`ADMIN_PASSWORD_HASH=${hash}`);
        
        console.log('\nOpción 2 - Con comillas simples (RECOMENDADO):');
        console.log(`ADMIN_PASSWORD_HASH='${hash}'`);
        
        console.log('\nOpción 3 - Escapando los $ con \\:');
        const escapedHash = hash.replace(/\$/g, '\\$');
        console.log(`ADMIN_PASSWORD_HASH="${escapedHash}"`);
        
        console.log('\nOpción 4 - Codificado en Base64 (si nada más funciona):');
        const base64Hash = Buffer.from(hash).toString('base64');
        console.log(`ADMIN_PASSWORD_HASH_B64=${base64Hash}`);
        console.log('// Y luego en tu código: Buffer.from(process.env.ADMIN_PASSWORD_HASH_B64, "base64").toString()');
        
        return hash;
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Ejecutar con tu contraseña
generateHashForEnv('AdminExplore2024!');