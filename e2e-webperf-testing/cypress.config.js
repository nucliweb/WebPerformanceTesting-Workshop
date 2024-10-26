const { defineConfig } = require("cypress");
const CDP = require("chrome-remote-interface");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on("task", {
        async throttleCpu(rate) {
          try {
            // Conecta al navegador usando Chrome DevTools Protocol
            const client = await CDP({ port: 9222 });

            // Activa el CPU throttling usando el protocolo de Emulation
            await client.Emulation.setCPUThrottlingRate({ rate });

            // Cierra la conexión cuando termine
            client.close();

            return null; // Indica que la tarea fue completada exitosamente
          } catch (error) {
            console.error("Error al aplicar CPU throttling:", error);
            return false;
          }
        },
      });

      return config;
    },
  },
});
