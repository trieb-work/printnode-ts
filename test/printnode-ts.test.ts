import Printnode from '../src/printnode-ts'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('Printnode is instantiable', () => {
    expect(new Printnode({ apiKey: '45646' })).toBeInstanceOf(Printnode)
  })
})
