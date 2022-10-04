General
- Default link / or homepage to wishes
- Look into formik
- Look into material UI

Functionality
- Add bulk edits to category, wishlist, description
- Filter by wishlist
- Add sign up/create user and also email to sign up
- Select wishes and provide cost and count for selected at top
- Create a new wishlist from add button on add wish, cant be in current list
  - maybe validate on entering values, not on submit (when lose focus?)
- Modify auto wishes and have them still save and be updated (only certain fields)
  - have to retrieve from backend once we know which we have or dont update certain values in DB
- export to file to send someone (flesh this out more))
- add in verify in case an item changes or seems to have a matching item (idk if need)
- add in priority tiers flags
- validate jwt token especially if tampered

Backend
- Add identical test db within local and cloud DB with ability to toggle with setting or UI
- Fix duplicate key error bulk insert mongoengine or convert back to bulkpymongo
- Dont delete items in database that dont have corresponding wishlist, instead set them to hidden/collapsed (just in case wishlist is brought back and so we dont remove priority and other things we did to that item)
- Parse special characters from description and name
- find common elements to simplify html parsing
- handle rei stock and cost
- remove items from wishlists that are no longer there (check id of items from that wishlist link in db against ones we retrieve currently from online)

UI
- Left align inputs of fields regardless of label text length
- Make modify buttons be same size regardless of text
- Look into adding wishes directly from wish page rather than separate nav
- Selection checkboxes for wishes, totals and whatnot based on selected
- show add wish wishlist dropdown
  - items are built from distinct wishlist select from db
- show out of stock items as error and collapse them?
- Collapse wish items (save collapsed in db)
  - come up with UI for collapsed element to show relevant data (name abbreviated, list, cost)
- add stock indicator icon (red triangle out of stock, green check in stock)
- banner/header
- Add mobile view
- Fix when shrinking browser window
- nav menu fold up hamburger, collapse/open on hover

Validation
- Validate link and name are input on wishlist
- Add https:// on link add wishlist

BUGS

BIG LIFTS
- move to AWS beanstalk or serverless
- Fix heroku

========================================================================
DONE
- Fix edit on wishes breaking
- bootstrap?
- add login
- Add in "Manage wishlists" nav link and have backend loop through them based on site
- Parse only lists in wishlists and remove all auto items that arent in those lists
- Deletion of manual wishes
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