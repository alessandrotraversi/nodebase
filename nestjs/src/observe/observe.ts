import { createObserveModule } from '@nestjs/observe';

// `createObserveModule()` returns both the dynamic module (registered in
// AppModule below) and the instrumentation hook Nest needs at bootstrap
// (passed to NestFactory.create in main.ts) — they must come from the same
// call, which is why this lives in its own file instead of inline in either.
export const { ObserveModule, ObserveInstrument } = createObserveModule();
