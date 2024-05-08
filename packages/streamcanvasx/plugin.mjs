import webWorkerLoader from 'rollup-plugin-web-worker-loader-pkg';


/**
 * @type {import('@ice/pkg').Plugin}
 */

const plugin = (api) => {
  const { onGetConfig } = api;

  console.info("--------------------------------");
  onGetConfig(config => {
    config.modifyRollupOptions ??= [];
    config.modifyRollupOptions.push((rollupOptions) => {
        console.info(rollupOptions.plugins);
        rollupOptions.plugins.push(webWorkerLoader({
            // Configuration options here
            inline: true,
            sourcemap: false,
            webWorkerPattern: /(.*)(-)?[wW]orker\.[jt]s$/

        }));

          console.log('++++++++++++++++++++++');

          console.info(rollupOptions.plugins);

          console.log('++++++++++++++++++++++');

      return rollupOptions;
    });
  });
};

export default plugin;
