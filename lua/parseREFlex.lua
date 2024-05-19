local params = {...}

dofile(params[1])
local json = require("json")
local json_data = json.encode(REFlexDatabase)

print(json_data)