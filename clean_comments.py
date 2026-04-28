import glob
import os
import re

PAGES_DIR = "frontend/src/pages"
jsx_files = glob.glob(os.path.join(PAGES_DIR, "*.jsx"))

# We want to identify lines that are essentially former HTML comments, e.g., " TopNavBar ", " Hero Section "
# These lines are typically just text without any '<' or '{' or '}' and only contain words/spaces.
# They might also just have been converted incorrectly resulting in just text on a line.

def is_comment_line(line):
    stripped = line.strip()
    if not stripped:
        return False
    # If the line represents typical free-floating text in the JSX that shouldn't be there.
    # We will exclude lines that are part of import statements, function declarations, etc.
    # Fortunately these rogue lines are usually inside the JSX tree. They have no tags.
    if '<' in stripped or '>' in stripped or '{' in stripped or '}' in stripped or ';' in stripped or 'import' in stripped or 'export' in stripped or 'return' in stripped:
        return False
    # If it's pure text with alphabets, spaces
    if re.fullmatch(r'[A-Za-z0-9\s\-\/\(\)\,]+', stripped):
        # We also want to skip lines that are exactly text inside tags that matched this, 
        # but usually text inside tags follows a > right preceded, or is indented inside.
        # It's safer to just check against a known list or very specific pattern.
        # But wait, words inside tags could be on their own line! E.g. "Dashboard" inside <Link>
        return False
    return False

# Safer approach: search for known rogue comment patterns and wrap/delete them.
with open("frontend/src/pages/LandingPage.jsx", "r", encoding="utf-8") as f:
    text = f.read()

text = text.replace(" TopNavBar ", "")
text = text.replace(" Hero Section ", "")
text = text.replace(" Product Preview ", "")
text = text.replace(" Social Proof ", "")
text = text.replace(" Features Section ", "")
text = text.replace(" CTA Section ", "")
text = text.replace(" Footer ", "")
text = text.replace("surfaceing", "surfacing")

with open("frontend/src/pages/LandingPage.jsx", "w", encoding="utf-8") as f:
    f.write(text)

# We should do this across all pages for the common ones.
for file in jsx_files:
    with open(file, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Common ones
    content = content.replace(" TopNavBar ", "")
    content = content.replace(" Main Content ", "")
    content = content.replace(" Hero Section ", "")
    content = content.replace(" Product Preview ", "")
    content = content.replace(" Social Proof ", "")
    content = content.replace(" Features Section ", "")
    content = content.replace(" CTA Section ", "")
    content = content.replace(" Footer ", "")
    content = content.replace(" TopAppBar from JSON ", "")
    content = content.replace(" SideNavBar from JSON (assuming we are on Web as per instructions to show TopAppBar, we'll keep SideNav for the 70/30 layout anchor) ", "")
    content = content.replace(" SideNavBar ", "")
    content = content.replace(" Main Area ", "")
    content = content.replace(" Main Layout ", "")
    content = content.replace(" Header ", "")

    content = re.sub(r'^\s*TopNavBar\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*Main Content\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*SideNavBar\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*Hero Section\s*$', '', content, flags=re.MULTILINE)
    content = re.sub(r'^\s*Footer\s*$', '', content, flags=re.MULTILINE)

    with open(file, "w", encoding="utf-8") as f:
        f.write(content)

print("Cleaned up naked HTML comments.")
