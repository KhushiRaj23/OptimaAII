export function entriesToMarkdown(entries,type){
    if(!entries.length) return "";
    if (!entries || entries.length === 0) return "";

    console.log("Debug Entries:", entries); // Debugging
    return (
        `## ${type}\n\n` + 
        entries
        .map((entry)=>{
            if(!entry) return "";
            const dataRange=entry.current 
            ?`${entry.startDate} - Present` :`${entry.startDate} - ${entry.endDate}`;
            return `### ${entry.title} @ ${entry?.organization}\n${dataRange}\n\n${entry.description}`
        })
        .join('\n\n')
    )
}