const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

// Función para leer un archivo JSON
function readJsonFile(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Error leyendo ${filePath}:`, error.message);
        process.exit(1);
    }
}

// Función para escribir un archivo JSON
function writeJsonFile(filePath, content) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
    } catch (error) {
        console.error(`Error escribiendo ${filePath}:`, error.message);
        process.exit(1);
    }
}

// Función principal
function main() {
    console.log('🚀 Iniciando proceso de instalación...');

    // Leer ambos package.json
    const globalPackage = readJsonFile('./global_package.json');
    const localPackage = readJsonFile('./package.json');

    // Crear package.json temporal combinado
    const combinedPackage = {
        ...localPackage,
        dependencies: {
            ...(localPackage.dependencies || {}),
            ...globalPackage.dependencies
        },
        devDependencies: {
            ...(localPackage.devDependencies || {}),
            ...globalPackage.devDependencies
        }
    };

    // Guardar el package.json combinado
    writeJsonFile('./package.json', combinedPackage);

    console.log('📦 Instalando dependencias...');
    
    try {
        // Ejecutar npm install
        execSync('npm install', { stdio: 'inherit' });
        console.log('✅ Instalación completada exitosamente!');
    } catch (error) {
        console.error('❌ Error durante la instalación:', error.message);
        process.exit(1);
    }
}

// Ejecutar el script
main();