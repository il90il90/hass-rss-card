import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';

export default {
  input: 'src/hass-rss-card.ts',
  output: {
    file: 'dist/hass-rss-card.js',
    format: 'es',
  },
  plugins: [
    resolve({ browser: true }),
    typescript(),
  ],
  onwarn(warning, warn) {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    warn(warning);
  },
};
