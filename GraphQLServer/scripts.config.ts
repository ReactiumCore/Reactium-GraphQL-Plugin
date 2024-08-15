import { DenonConfig } from 'https://deno.land/x/denon@2.5.0/mod.ts';

const config: DenonConfig = {
  allow: ['net', 'env', 'read', 'write'],
  scripts: {
    start: {
      cmd: 'deno run app.ts',
      desc: 'run my app.ts file',
    },
    debug: {
      cmd: 'deno run --inspect-brk app.ts',
      desc: 'run app.ts in debug mode',
    },
  },
  watcher: {
    skip: ['.git/**/*', 'db/**/*.json'],
    exts: ['js', 'ts', 'json'],
  },
};

export default config;
