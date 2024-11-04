/**
 * Represents one row in the results returned by Polypheny.
 */
export class PolyphenyResult {
  /**
   * Used for styling if the results are ordered
   */
  index: number;
  data: Record<string, any>

  constructor(index: number, data: Record<string, any>) {
    this.index = index;
    this.data = data;
  }
}
