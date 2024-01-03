import ejs from 'ejs'
export default class EjsService {
  renderFile(template: string, data: any): Promise<string> {
    return ejs.render(template, data, { async: true })
  }
}
