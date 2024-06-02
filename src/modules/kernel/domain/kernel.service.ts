export class KernelService {
  static random(): number {
    return Math.floor(Math.random() * 100000000)
  }
}