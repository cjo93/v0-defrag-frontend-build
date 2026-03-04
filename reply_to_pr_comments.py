import urllib.request
import json
import os

req = urllib.request.Request(
    'http://localhost:8080/reply_to_pr_comments',
    data=json.dumps({
        'replies': json.dumps([
            {
                "comment_id": "3994413248",
                "reply": "Understood. Acknowledging that this work is superseded and stopping work on this PR."
            }
        ])
    }).encode('utf-8'),
    headers={'Content-Type': 'application/json'}
)

try:
    with urllib.request.urlopen(req) as response:
        print(response.read().decode('utf-8'))
except urllib.error.URLError as e:
    print(f"Error: {e}")
