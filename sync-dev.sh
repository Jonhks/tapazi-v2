#!/bin/bash

echo "================================================"
echo "📥 ACTUALIZANDO DEV CON LOS ROBOTS DE MAIN 🤖"
echo "================================================"

# Asegurándonos de estar en dev
git checkout dev

# Comprobar que no haya cambios sueltos
if ! git diff-index --quiet HEAD --; then
    echo "❌ ERROR: Tienes código sin guardar en 'dev'."
    echo "Por favor haz un commit ('git add .' y 'git commit') antes de actualizar."
    exit 1
fi

echo "🔄 Descargando la nube..."
git fetch origin

echo "🧬 Fusionando los commits de versión desde main..."
git merge origin/main -m "Merge: Actualizando dev con los nuevos bumps de versión de main"

echo "⬆️ Respalando tu dev nuevo en GitHub..."
git push origin dev

echo "================================================"
echo "🎉 ¡Todo sincronizado! Tu rama dev ya está lista."
echo "================================================"
