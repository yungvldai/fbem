import { LoaderContext } from 'webpack';

import { Options } from '../types/options';

export const resolveRequests = async (
  resolve: ReturnType<LoaderContext<Options>['getResolve']>,
  context: string,
  possibleRequests: string[]
): Promise<string> => {
  try {
    const result = await resolve(context, possibleRequests[0]);
    return result;
  } catch (error) {
    const [, ...tailPossibleRequests] = possibleRequests;

    if (tailPossibleRequests.length === 0) {
      throw error;
    }

    return await resolveRequests(resolve, context, tailPossibleRequests);
  }
};
