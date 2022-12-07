import { ApplicationSettingsSubCategory } from '../types'

export const applicationSettings: ApplicationSettingsSubCategory[] = [
  {
    name: 'Window Settings',
    settings: [
      {
        name: 'Launch on Startup',
        desc: "The app will open during your computer's startup phase.",
        type: 'toggle'
      },
      {
        name: 'Minimize on Startup',
        desc: "The app will open quietly in the background on startup. Requires 'Launch on Startup' to be enabled.",
        type: 'toggle'
      },
      {
        name: 'Minimize on Close',
        desc: 'Pressing X will minimize the app instead of closing it.',
        type: 'toggle'
      }
    ]
  },
  {
    name: 'Delay Settings',
    settings: [
      {
        name: 'Auto-add Delay',
        desc: 'When enabled, a delay element is automatically added to the sequence, if the last element of the sequence is not a delay.',
        type: 'toggle'
      },
      {
        name: 'Default Delay Value',
        desc: 'The value (in ms) that all Delay elements will default to when added to the sequence.',
        type: 'numberInput'
      }
    ]
  },
  {
    name: 'Macro Creation Settings',
    settings: [
      {
        name: 'Auto-select Element on add',
        desc: 'When enabled, adding a new element automatically selects it for Editing (if applicable), rendering related options in the Edit Panel.',
        type: 'toggle'
      }
    ]
  }
]
