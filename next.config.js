module.exports = {
    exportPathMap: async function (
      defaultPathMap,
      { dev, dir, outDir, distDir, buildId }
    ) {
      return {
        '/': { page: '/login' },
        '/login': { page: '/login' },
        '/signup' : {page: '/signup'}
      }
    },
  }