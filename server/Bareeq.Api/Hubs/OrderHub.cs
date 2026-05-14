using Microsoft.AspNetCore.SignalR;

namespace Bareeq.Api.Hubs;

public class OrderHub : Hub
{
    public async Task JoinBranch(string branchId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"branch-{branchId}");
    }

    public async Task LeaveBranch(string branchId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"branch-{branchId}");
    }
}
