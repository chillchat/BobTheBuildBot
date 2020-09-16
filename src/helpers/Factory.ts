export function Factory<FuncType>(
  func: (...args: any[]) => FuncType
): (...args: any[]) => FuncType {
  return func;
}
