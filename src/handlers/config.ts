import Config, { GlobalConfig } from 'config';
import prompts from 'prompts';
import ConfigType from 'enums/ConfigType';
import { ConfigOptions } from 'enums/Options';

const config = new Config(ConfigType.CONFIG);

enum SubCommand {
  ENABLE = 'ENABLE',
  DISABLE = 'DISABLE',
}

const configure = async (type: SubCommand) => {
  const global = config.list() as GlobalConfig;
  const keys = Object.keys(global).filter(key =>
    type === SubCommand.ENABLE
      ? !global[key as ConfigOptions]
      : global[key as ConfigOptions],
  );

  if (!keys || !keys.length) {
    process.exit(0);
  }

  const { option } = await prompts({
    type: 'autocomplete',
    name: 'option',
    message: 'Choose a gitmoji',
    choices: keys.map(key => ({
      title: key,
      value: key,
    })),
    suggest: (input, choices) => {
      return Promise.resolve(
        choices.filter(i =>
          i.title.toLowerCase().includes(input.toLowerCase()),
        ),
      );
    },
  });

  if (!option) {
    process.exit(0);
  }

  config.set(option, type === SubCommand.ENABLE);
};

export default {
  enable: async () => {
    await configure(SubCommand.ENABLE);
  },
  disable: async () => {
    await configure(SubCommand.DISABLE);
  },
  list: () => {
    console.log(JSON.stringify(config.list(), null, 2));
  },
};