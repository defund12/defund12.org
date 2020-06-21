# Letter template style guide

Please refer to the [EMAIL_TEMPLATE_STYLE_GUIDE.md], the only differences from that are

1. Letters should *NOT* include a salutation (e.g., “Dear X,”) - this will be added automatically
2. Letters *NOT* end with a sign-off, these will be automatically added
3. In the template, `layout` should be set to `letter` not email
4. `permalink` should look like "/letters/city_slug"
5. There should be a entry in the template called "officials" with a list of the types of elected officials you would like to target with this letter
   - To see if the API we are using (the [Google Civic Information API](https://www.google.com/search?q=google+civis+api+demo&oq=google+civis+api+demo&aqs=chrome..69i57j69i64.2459j0j7&sourceid=chrome&ie=UTF-8)) has information for the city you are interested in, go to https://myreps.datamade.us/, enter an address and see if city council is in there
   - If it is not, consider adding a city council scraper to https://github.com/blackmad/city-council-data
   - This field is a list of `level:role` entries using the levels and roles found at https://developers.google.com/civic-information/docs/v2/representatives/representativeInfoByAddress
   - for most places, adding `- locality:*` will be good enough, that will target all elected officials at the city level. If you want just city council, it's `- locality:legislatorUpperBody`, just the mayor would be `- locality:headOfState`
      - tech note: at the locality level, google is really bad about including the correct "role" in their responses. We infer it when it is missing.
   - For places with a combined city-county government, like San Francisco, or, I believe Indianapolis, you will likely want `administrativeArea2` instead of `locality`. There is not a great way to determine this from the datamade tool. It is obvious if you look directly at the google API response.

