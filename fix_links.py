import os
import glob
import re

PAGES_DIR = "frontend/src/pages"

# Define the text-to-route mapping
LINK_MAP = {
    "Dashboard": "/dashboard",
    "Analytics": "/analytics",
    "Fleet": "/fleet",
    "Fleet Monitor": "/fleet",
    "Shipments": "/shipments",
    "Live Monitoring": "/fleet",
    "Route Optimization": "/dashboard",
    "Risk Analysis": "/dashboard",
    "Carrier Performance": "/analytics",
    "History": "/reporting",
    "Reporting": "/reporting",
    "Settings": "/settings",
    "Archive": "/reporting",
    "Support": "/settings",
    "Documentation": "/settings",
    "Login": "/login",
    "Register": "/register",
    "Forgot password?": "/login",
    "Product": "/",
    "Features": "/",
    "Partners": "/",
    "Pricing": "/",
    "Privacy Policy": "/",
    "Terms of Service": "/",
    "Security": "/",
    "Contact": "/",
    "Routes": "/dashboard",
    "Network": "/dashboard",
    "Logistics": "/dashboard",
    "Log Out": "/login",
    "Risks": "/dashboard",
    "Alert": "/dashboard",
}

jsx_files = glob.glob(os.path.join(PAGES_DIR, "*.jsx"))

for file_path in jsx_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # We need to find all <Link ...>...</Link> blocks
    # Specifically those where to="#"
    # Since regex over multiline JSX is tricky, we'll try to find <Link ... to="#">
    # and then check the text immediately following it before </Link>
    
    def replacer(match):
        pre_link = match.group(1) # <Link className="..."
        post_link_open = match.group(2) # >
        inner_content = match.group(3) # <span...>icon</span> Text
        
        # Determine the correct route by checking if any key is in the inner content
        new_to = 'to="/"'
        for key, route in LINK_MAP.items():
            if key in inner_content:
                new_to = f'to="{route}"'
                break
                
        # Return the Reassembled string
        return f'{pre_link}{new_to}{post_link_open}{inner_content}</Link>'

    # Regex: 
    # ( <Link[^>]* )             group 1
    # \s*to="(?:#|/dashboard)"   group 2 (match # or /dashboard so we can fix everything properly)
    # ( [^>]*> )                 group 3
    # ( .*? )                    group 4 (inner HTML)
    # </Link>
    
    # We will just replace ALL to="..." to the correct one based on inner text
    
    content_new = re.sub(
        r'(<Link[^>]*)to="[^"]*"([^>]*>)(.*?)</Link>',
        replacer,
        content,
        flags=re.DOTALL
    )
    
    if content != content_new:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content_new)
        print(f"Fixed routings in {os.path.basename(file_path)}")
