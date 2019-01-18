const {
  CSSPlugin,
  EnvPlugin,
  FuseBox,
  Sparky,
  WebIndexPlugin
} = require('fuse-box');

const path = require('path');

Sparky.task('build', () => {

  const fuse = FuseBox.init({
    homeDir: 'src/',
    output: 'dist/$name.js',
    target: 'electron',
    plugins: [
      EnvPlugin({ DIST_DIR: path.join(__dirname, 'dist/') }),
      CSSPlugin(),
      WebIndexPlugin({
        template: 'src/window.html',
        title: 'typesafe-ipc example app',
        target: 'window.html',
        path: '.',
        bundles: ['renderer']
      })
    ]
  });

  fuse.bundle('renderer').instructions('> [renderer.ts] + fuse-box-css');
  fuse.bundle('main').instructions('> [main.ts]');

  return fuse.run();
});

Sparky.task('default', ['clean:dist', 'clean:cache', 'build'], () => {});
Sparky.task('clean:dist', () => Sparky.src('dist/*').clean('dist/'));
Sparky.task('clean:cache', () => Sparky.src('.fusebox/*').clean('.fusebox/'));
