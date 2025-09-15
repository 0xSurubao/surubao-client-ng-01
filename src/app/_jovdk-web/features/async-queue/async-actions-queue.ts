export class AsyncActionsQueue {
    _actionsQueue: AsyncAction[] = [];
    _isBudy = false;

    EqueueAction = (action: () => Promise<void>) => {
        let newAsyncAction: AsyncAction = {
            Action: action,
        };

        this._actionsQueue.push(newAsyncAction);

        this.TryToRunNextAction();
    };

    TryToRunNextAction = async () => {
        if (!this._isBudy) {
            if (this._actionsQueue.length > 0) {
                this._isBudy = true;

                let asyncAction = this._actionsQueue.shift();

                if (asyncAction != undefined && asyncAction.Action != null)
                    await asyncAction.Action();

                this._isBudy = false;
                this.TryToRunNextAction();
            }
        }
    };
}

export class AsyncAction {
    Action: (() => Promise<void>) | null = null;
}