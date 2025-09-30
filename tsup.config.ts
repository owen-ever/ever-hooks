import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true, // 타입 선언 파일 생성
  format: ['esm', 'cjs'],
  sourcemap: true,
  clean: true,
  outDir: 'dist',
  external: ['react', 'react-dom'], // peerDependencies는 external 처리
  esbuildOptions(options) {
    // React JSX 지원
    options.jsx = 'automatic';
  },
});
