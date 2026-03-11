#!/bin/bash

# Este script hace el pase a producción de forma segura
# respetando la exclusión de axios.ts usando el driver local de Git.

echo "================================================"
echo "🚀 INICIANDO DESPLIEGUE SEGURO A MAIN (PROD)"
echo "================================================"

# Asegurándonos que el árbol de trabajo actual esté limpio
if ! git diff-index --quiet HEAD --; then
    echo "❌ ERROR: Tienes cambios sin guardar en tu rama actual."
    echo "Por favor haz commit o stash antes de intentar desplegar."
    exit 1
fi

echo "🔄 Descargando últimos cambios del servidor..."
git fetch origin

echo "🔀 Cambiando a rama main..."
git checkout main
git pull origin main

echo "🤝 Fusionando dev en main de forma segura..."
echo "(Git ignorará automáticamente src/lib/axios.ts)"
git merge dev -m "Merge branch 'dev' into main - Seguro (Ignora axios.ts)"

echo "⬆️ Subiendo cambios a producción (GitHub)..."
git push origin main

echo "✅ DESPLIEGUE A PRODUCCIÓN COMPLETADO CON ÉXITO."
echo "🔄 Volviendo a tu rama de desarrollo..."
git checkout dev

echo "================================================"
echo "🎉 ¡Todo listo!"
echo "================================================"
