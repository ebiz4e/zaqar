import { injectable, inject } from 'tsyringe'
import { Email } from '../domain'
import { SendgridClient } from '../data/repositories/SendgridClient'
import { IEmail } from '../domain/email/structures/IEmail'
import { RenderService } from './RenderService'

@injectable()
export class EmailService {
  constructor (@inject('SenderConfig') private readonly senderConfig: { fromAddress: string, fromName: string }, private readonly client: SendgridClient, private readonly renderService: RenderService) {
    //
  }

  async sendEmail (emailData: IEmail): Promise<Email> {
    if (!emailData.from) emailData.from = { name: this.senderConfig.fromName, email: this.senderConfig.fromAddress }
    const email = new Email(emailData, this.renderService)
    await email.compileTemplate()
    return this.client.send(email)
  }
}
