General
- 

Functionality
- Deletion of manual wishes
- Parse only lists in wishlists and remove all auto items that arent in those lists
- Add in "Manage wishlists" nav link and have backend loop through them based on site
- Create a new wishlist from add button on add wish, cant be in current list
  - maybe validate on entering values, not on submit (when lose focus?)
- Modify auto wishes and have them still save and be updated (only certain fields)
  - have to retrieve from backend once we know which we have or dont update certain values in DB
- add login
- export to file to send someone (excel?)
- add in verify in case an item changes or seems to have a matching item

Backend
- Fix duplicate key error bulk insert mongoengine or convert back to bulkpymongo
- Parse special characters from description and name
- find common elements to simplify html parsing
- handle rei stock and cost
- remove items from wishlists that are no longer there

UI
- Look into adding wishes directly rather than separate nav
- show add wish wishlist dropdown
  - items are built from distinct wishlist select from db
- show out of stock items as error and collapse them?
- add stock indicator
- banner
- nav menu fold up hamburger
- bootstrap?

Validation
- Validate link and name are input on wishlist
- Add https:// on link add wishlist

BUGS
- Fix edit on wishes breaking

========================================================================
DONE
- group isdev and isheroku logic
- only call db connect once
- move refresh from websites into separate runnable file
  - refresh only asynchronously and on manual button
- only make logger once
- Amazon never returning 
  - SOLUTION: fix parsing tags, check if captcha is none then show
- prompt in case trying to save invalid wishlist item
- merge refactoring into main
- add wishlistLink
- button CSS
- fields CSS
- link imported wishes to unique key so can be consistently edited
- add edit button on each wishlist item
- need something in name and cost field
- only numbers in cost/quantity

MAYBE LATER:
- figure out Amazon captcha or refresh on frontend

NOT ANYMORE:
- parse Etsy