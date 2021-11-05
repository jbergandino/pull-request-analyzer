GitHub Pull Request Analyzer - Notes Below


Github API docs: https://developer.github.com/v3/  

Access all pull requests:
https://docs.github.com/en/rest/reference/pulls#list-pull-requests

General info on pull requests:
https://docs.github.com/en/rest/reference/pulls

Adding Pull Request Search Specifics --- Cmd+F for "Search only issues or pull requests" OR "Search by open or closed state"
https://docs.github.com/en/search-github/searching-on-github/searching-issues-and-pull-requests

Examples:
    
    Search only issues or pull requests:
    type:pr cat type:pr matches pull requests with the word "cat."
    type:issue  github commenter:defunkt type:issue matches issues that contain the word "github," and have a comment by @defunkt.
    is:pr   event is:pr matches pull requests with the word "event."
    is:issue    is:issue label:bug is:closed matches closed issues with the label "bug."

    Search by open or closed state:
    state:open  libraries state:open mentions:vmg matches open issues that mention @vmg with the word "libraries."
    state:closed    design state:closed in:body matches closed issues with the word "design" in the body.
    is:open performance is:open is:issue matches open issues with the word "performance."
    is:closed   android is:closed matches closed issues and pull requests with the word "android."


API JSON Pagination Info:
- Requests that return multiple items will be paginated to 30 items by default. You can specify further pages with the page parameter. For some resources, you can also set a custom page size up to 100 with the per_page parameter.
- Note that page numbering is 1-based and that omitting the page parameter will return the first page. Also, some endpoints use cursor-based pagination (see https://docs.github.com/en/rest/overview/resources-in-the-rest-api for more info)


Primary Endpoint Params:
Name    Type    In  
---Description
--------------------------------------
accept  string  header  
---Setting to application/vnd.github.v3+json is recommended.

q   string  query   
---The query contains one or more search keywords and qualifiers. Qualifiers allow you to limit your search to specific areas of GitHub. The REST API supports the same qualifiers as GitHub.com. To learn more about the format of the query, see Constructing a search query. See "Searching issues and pull requests" for a detailed list of qualifiers.

sort    string  query   
---Sorts the results of your query by the number of comments, reactions, reactions-+1, reactions--1, reactions-smile, reactions-thinking_face, reactions-heart, reactions-tada, or interactions. You can also sort results by how recently the items were created or updated, Default: best match

order   string  query   
---Determines whether the first search result returned is the highest number of matches (desc) or lowest number of matches (asc). This parameter is ignored unless you provide sort.
Default: desc

per_page    integer     query   
---Results per page (max 100) - Default: 30

page    integer     query   
