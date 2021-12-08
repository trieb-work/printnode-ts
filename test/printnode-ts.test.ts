import Printnode from '../src/printnode-ts'

let printNodeClient: Printnode

const apiKey = process.env.PRINTNODE_API_KEY || '45646'
/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('Printnode is instantiable', () => {
    printNodeClient = new Printnode({ apiKey })
    expect(printNodeClient).toBeInstanceOf(Printnode)
  })
})

describe('Full tests with real printnode account', () => {
  it('should be able to get a list of printers', async () => {
    const printers = await printNodeClient.getPrinters()
    console.log(printers)
  })
})
