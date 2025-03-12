export function formatMessageTime(date) 
{
    return new Date(date).toLocaleTimeString("en-US" , {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        
    });
}