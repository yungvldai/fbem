import postcss, { AcceptedPlugin } from 'postcss';
import postcssIcssKeyframes from 'postcss-icss-keyframes';
import postcssIcssSelectors from 'postcss-icss-selectors';
import Processor from 'postcss/lib/processor';

export const getProcessor = (additionalPlugins: AcceptedPlugin[] = []): Processor =>
  postcss([
    ...additionalPlugins,
    postcssIcssKeyframes(),
    postcssIcssSelectors({
      mode: 'local',
    }),
  ]);
