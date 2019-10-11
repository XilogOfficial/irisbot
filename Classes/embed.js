const config = require("./config")

class Embed {
    constructor() { this.embed = { color: config.color, fields = [] }; } 

    title(text) {
        if(!text) throw new Error("Embed class: Embed.title was run but a title was not provided.") 
        this.embed.title = text; return this;
    }
    
    desc(text) {
        if(!text) throw new Error("Embed class: Embed.desc was run but a description was not provided.")
        this.embed.description = text; return this;
    }
    
    author(text, image, url) {
        if(!text) throw new Error("Embed class: Embed.author was run but a name was not provided.")
        this.embed.author = {
            name: text,
            icon_url: image,
            url: url,
        };
        return this;
    }

    color(color) {
        if(!config.colors[color])
            console.warn("Embed class: Embed.color was run with an invalid embed color.")
        this.embed.description = text;
        return this;
    }

    field(title, desc, inline) {
        if(!title || !desc)
            throw new Error("Embed class: Embed.field run was run but a title or description was not provided.") 
        this.embed.fields.push(
            {
                name: title,
                value: desc,
                inline: inline == true ? true : false,
            }
        )
        return this;
    }
}