import axios, { AxiosInstance } from 'axios'

type Config = {
  apiKey: string
}

type Papers = {
  [key: string]: [number, number]
}

type Printers = {
  capabilities: {
    bins: ['Automatisch auswählen']
    collate: true
    color: false
    copies: 9999
    dpis: ['300x300', '300x600']
    duplex: boolean
    extent: [[127, 222], [618, 27093]]
    medias: ['Default']
    nup: [1, 2, 4, 6, 9, 16]
    papers: {
      '11353 Multi-Purpose': [254, 254]
      '11354 Multi-Purpose': [571, 317]
      '11355 Multi-Purpose': [190, 508]
      '11356 White Name badge': [413, 889]
      '14681 CD/DVD Label': [586, 660]
      '30252 Address': [278, 889]
      '30253 Address (2 up)': [586, 889]
      '30256 Shipping': [587, 1016]
      '30258 Diskette': [540, 698]
      '30277 File Folder (2 up)': [286, 872]
      '30299 Jewelry Label (2 up)': [541, 222]
      '30320 Address': [278, 889]
      '30321 Large Address': [357, 885]
      '30323 Shipping': [540, 1008]
      '30324 Diskette': [540, 698]
      '30325 Video Spine': [190, 1492]
      '30326 Video Top': [460, 778]
      '30327 File Folder': [198, 872]
      '30330 Return Address': [190, 508]
      '30332 1 in x 1 in': [254, 254]
      '30333 1/2 in x 1 in (2 up)': [254, 254]
      '30334 2-1/4 in x 1-1/4 in': [571, 317]
      '30335 1/2 in x 1/2 in (4 up)': [257, 301]
      '30336 1 in x 2-1/8 in': [254, 540]
      '30337 Audio Cassette': [413, 889]
      '30339 8mm Video (2 up)': [190, 714]
      '30345 3/4 in x 2-1/2 in': [190, 635]
      '30346 1/2 in x 1-7/8 in': [127, 476]
      '30347 1 in x 1-1/2 in': [254, 381]
      '30348 9/10 in x 1-1/4 in': [228, 317]
      '30364 Name Badge Label': [587, 1016]
      '30365 Name Badge Card': [589, 889]
      '30370 Zip Disk': [508, 595]
      '30373 Price Tag Label': [248, 508]
      '30374 Appointment Card': [508, 889]
      '30376 Hanging File Insert': [279, 508]
      '30383 PC Postage 3-Part': [571, 1778]
      '30384 PC Postage 2-Part': [587, 1905]
      '30387 PC Postage EPS': [587, 2667]
      '30854 CD Label': [586, 660]
      '30856 Badge Card Label': [618, 1028]
      '30857 Badge Label': [587, 1016]
      '30886 CD Label': [392, 444]
      '99010 Standard Address': [278, 889]
      '99012 Large Address': [357, 885]
      '99014 Name Badge Label': [540, 1008]
      '99014 Shipping': [540, 1008]
      '99015 Diskette': [540, 698]
      '99016 Video Spine': [220, 1476]
      '99016 Video Top': [490, 778]
      '99017 Suspension File': [127, 508]
      '99018 Small Lever Arch': [380, 1899]
      '99019 Large Lever Arch': [587, 1899]
      Banner: [540, 27093]
      'Continuous, Wide': [540, 2794]
    }
    printrate: null
    supports_custom_paper_size: false
  }
  computer: {
    createTimestamp: string
    hostname: string
    id: number
    inet: '10.10.6.10'
    inet6: null
    jre: null
    name: string
    state: 'connected'
    version: '4.24.0'
  }
  createTimestamp: string
  default: false
  description: string
  id: number
  name: string
  state: 'online'
}

type Rotate = 0 | 90 | 180
type Options = {
  fit_to_page?: boolean
  rotate?: Rotate
  paper?: string
  bin?: string
  media?: string
  duplex?: 'long-edge' | 'short-edge' | 'one-sided'
}

export default class PrintNode {
  private apiKey: string

  private instance: AxiosInstance

  constructor(config: Config) {
    this.apiKey = config.apiKey
    this.instance = axios.create({
      baseURL: 'https://api.printnode.com',
      timeout: 4000,
      auth: {
        username: this.apiKey,
        password: ''
      }
    })
  }

  /**
   * Get a list of all printers we have access to
   */
  getPrinters = async () => {
    const printers = await this.instance({
      url: '/printers'
    })
    if (!printers.data || printers.data.length < 1) throw new Error('No printers returned!')
    return printers.data as Printers[]
  }

  /**
   * This functions sends a base64 decoded PDF to a printer via the printNode network
   * @param base64String
   * @param fileName
   * @param printerId
   * @param qty How many times you want to print this documents
   * @param IdempotencyString
   */
  printBase64 = async (
    base64String: string,
    fileName: string,
    printerId: number,
    qty = 1,
    {
      IdempotencyString,
      rotate,
      fitToPage = true,
      paper
    }: { IdempotencyString?: string; rotate?: Rotate; fitToPage?: boolean; paper?: string }
  ) => {
    const headers = {
      'X-Idempotency-Key': IdempotencyString || ''
    }
    const options: Options = {
      rotate
    }
    if (fitToPage) options.fit_to_page = fitToPage
    if (paper) options.paper = paper
    const response = await this.instance({
      url: '/printjobs',
      method: 'POST',
      headers,
      data: {
        printerId,
        title: `${fileName}`,
        contentType: 'pdf_base64',
        content: base64String,
        source: 'Automatically generated from the trieb.work lib',
        qty,
        options
      }
    })
    return response.data
  }

  printData = async ({
    printerId,
    title,
    source,
    qty = 1,
    contentUrl,
    base64Content,
    options
  }: {
    printerId: string
    title?: string
    source?: string
    options: Options
    qty?: number
    contentUrl?: string
    base64Content?: string
  }) => {
    const data = {
      printerId,
      content: contentUrl ?? base64Content,
      contentType: contentUrl ? 'pdf_uri' : 'pdf_base64',
      title,
      source,
      qty,
      options
    }

    const response = await this.instance({
      url: '/printjobs',
      method: 'POST',
      data
    })
    return response.data
  }
}
