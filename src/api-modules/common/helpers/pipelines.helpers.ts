import { PipelineStage } from 'mongoose';
import { PaginationInput, SortInput } from 'src/api-modules/common/common.args';

export const getPaginatedPipeline = (
  sort?: SortInput,
  pagination?: PaginationInput
): PipelineStage[] => {
  const order = sort?.sortOrder as any;

  return [
    {
      $facet: {
        collection: [
          ...(sort ? [{ $sort: { [sort.sortBy]: order } }] : []),
          ...(pagination ? [{ $skip: pagination.skip }, { $limit: pagination.limit }] : []),
        ],
        totalCount: [{ $count: 'count' }],
      },
    },
    {
      $project: {
        totalCount: { $arrayElemAt: ['$totalCount.count', 0] },
        collection: '$collection',
      },
    },
  ];
};
