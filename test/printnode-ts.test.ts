import Printnode from '../src/printnode-ts'
import file from './file.temp'

let printNodeClient: Printnode

const apiKey = process.env.PRINTNODE_API_KEY || '45646'
const testPrinterId = '69855864'
const testUrl = process.env.PDF_URL

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
    expect(printers.length).toBeGreaterThan(0)
  })

  describe('Test to add a real page to printer queue', () => {
    it('should be able to add a print job with URL', async () => {
      const result = await printNodeClient.printData({
        printerId: testPrinterId,
        base64Content: file,
        title: 'Test Doc',
        options: {
          paper: 'A5',
          bin: 'rear',
          duplex: 'one-sided'
        }
      })
      expect(result).toBeDefined()
    })
  })
})
