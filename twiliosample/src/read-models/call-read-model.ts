import { ReadModel, Projects } from '@boostercloud/framework-core'
import { UUID, ProjectionResult } from '@boostercloud/framework-types'
import { Call } from '../entities/call'

@ReadModel({
  authorize: 'all'
})
export class CallReadModel {
  public constructor(
    public id: UUID,
    readonly toPhone: string,
    readonly message: string,
  ) {}

  @Projects(Call, "id")
  public static projectCall(entity: Call, currentCallReadModel?: CallReadModel): ProjectionResult<CallReadModel> {
    return new CallReadModel(entity.id, entity.toPhone, entity.message)
  }

}
