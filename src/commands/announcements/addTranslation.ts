import languages from '@cospired/i18n-iso-languages'
import { EmbedLimits, TextInputLimits } from '@sapphire/discord-utilities'
import { Subcommand } from '@sapphire/plugin-subcommands'
import { Modal } from 'discord.js'
import iso from 'iso-639-1'
import ow from 'ow'
import { MessageComponentTypes, TextInputStyles } from 'discord.js/typings/enums'
import { Announcement } from '../../schemas/Announcement'
import { validateChatInput } from '../../utils/validateOptions'

const schema = ow.object.exactShape({
  // eslint-disable-next-line sort/object-properties
  name: ow.string,
  lang: ow.string.oneOf(iso.getAllCodes()).message(() => 'commands:add-translation.notValidLanguage')
})

export async function addTranslation (interaction: Subcommand.ChatInputInteraction) {
  const options = await validateChatInput(interaction, schema)
  if (!options) return
  const { lang, name: id, t } = options

  const announcement = await Announcement.findById(id).exec().catch(() => {})
  if (!announcement) return await interaction.reply({ content: t('commands:add-translation.notFound'), ephemeral: true })
  if (announcement.translations.some((translation) => translation.lang === lang)) {
    return await interaction.reply({
      content: t('commands:add-translation.alreadyAdded', {
        language: languages.getName(lang, interaction.locale.split('-')[0])
      }),
      ephemeral: true
    })
  }

  const modal = new Modal()
    .setTitle(t('commands:add-translation.modalTitle'))
    .setCustomId(`addTranslation:${interaction.id}:${Date.now()}:${JSON.stringify([id, lang])}`)

  const components = [
    {
      customId: 'title',
      maxLength: EmbedLimits.MaximumTitleLength,
      required: false,
      style: TextInputStyles.PARAGRAPH,
      type: MessageComponentTypes.TEXT_INPUT
    },
    {
      customId: 'description',
      maxLength: TextInputLimits.MaximumValueCharacters,
      required: true,
      style: TextInputStyles.PARAGRAPH,
      type: MessageComponentTypes.TEXT_INPUT
    },
    {
      customId: 'footer',
      maxLength: EmbedLimits.MaximumFooterLength,
      required: false,
      style: TextInputStyles.PARAGRAPH,
      type: MessageComponentTypes.TEXT_INPUT
    },
    {
      customId: 'url',
      required: false,
      style: TextInputStyles.SHORT,
      type: MessageComponentTypes.TEXT_INPUT
    }
  ]
    .map((component) => ({
      ...component,
      label: t(`commands:add.modal.${component.customId}.label`),
      placeholder: t(`commands:add.modal.${component.customId}.placeholder`)
    }))

  // @ts-expect-error
  modal.setComponents([
    // ? Makes an actionRow for every textInput
    components
      .map((component) => ({
        components: [component],
        type: MessageComponentTypes.ACTION_ROW
      }))
  ])

  try {
    await interaction.showModal(modal)
  } catch (error) {
    console.debug(error)
  }
}
