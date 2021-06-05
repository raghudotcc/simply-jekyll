#####################################################################################################
#
# MIT License
# 
# Copyright (c) 2020 Raghuveer S
# 
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
# 
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
# 
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.
#
#
# Author@Raghuveer S
# This is a file I use with Notion to automatically convert my Notion documents to Blogposts
#
# How to use this file:
# ---------------------
# Disclaimer: 'TOKEN_V2' and 'BLOG_PAGE_ID' are different for each individual.
#   1. Get the 'token_v2' by inspecting notion on your browser. You should find it in the 
#       application tab in the browser inspector.
#   2. Create a page called 'Blog' on Notion. 
#   3. Now note down the long string in the url that comes after '?v='.
#   4. Replace the TOKEN_V2 and BLOG_PAGE_ID below with the noted strings.
#   5. Create a inline table with the following views: 1) Finished 2) Drafts 3) Archived
#   6. Write your post and tag them appropriately as finished/drafts/archived
#   7. Now run the python file using 'python3 NotionToJekyll.py'
#   8. You can now commit the file to github.
# Note: Remember that the steps from 1st to 5th are just one time steps.
#####################################################################################################

from notion.client import NotionClient
import os
import datetime

class NotionJekyll:
    def __init__(self, 
                 token_v2="TOKEN_V2",
                 blog_page_id="BLOG_PAGE_ID"):
        self.client = NotionClient(token_v2=token_v2)
        self.text = ''
        self.notion_to_md(blog_page_id)
        
    def indent(self, depth):
        spaces = ''
        for level in range(depth):
            spaces = spaces + "  "
        
        return spaces
    
    def md_gen_util(self, post, depth):
        for content in post.children:
            if content.type == 'header':
                self.text = self.text + '\n# ' + content.title + '\n\n'
            elif content.type == 'sub_header':
                self.text = self.text + '\n## ' + content.title + '\n\n'
            elif content.type == 'sub_sub_header':
                self.text = self.text + '\n### ' + content.title + '\n\n'
            elif content.type == 'table_of_contents':
                self.text = self.text + '\n* TOC\n{:toc}\n\n'
            elif content.type == 'code':
                self.text = self.text + '\n```' + content.language + '\n' + content.title + '\n```\n\n'
            elif content.type == 'quote':
                self.text = self.text + '\n> ' + content.title + '\n'
            elif content.type == 'image':
                self.text = self.text + '\n![' + content.id + '](' + content.source + ')\n\n'
            elif content.type == 'bulleted_list':
                self.text = self.text + self.indent(depth) +  '- ' + content.title + '\n'
            elif content.type == 'numbered_list': 
                self.text = self.text + self.indent(depth) + '1. ' + content.title + '\n'
            elif content.type == 'divider':
                self.text = self.text + '\n---' + '\n\n'
            elif content.type == 'callout':
                self.text = self.text + '\n{:.boxit}\n' + content.title + '\n\n'
            elif content.type == 'todo':
                self.text = self.text + '\n[ ] ' + content.title + '\n'
            elif content.type == 'toggle':
                self.text = self.text + self.indent(depth) + content.title + '\n'
            elif content.type == 'text':
                self.text = self.text + "\n" +self.indent(depth) + content.title + '\n\n'
            else:
                print(content.type)
        
            # Recursion for child blocks
            if content.children != None:
                self.md_gen(content, depth + 1)
        
        
    def md_gen(self, post, depth):
        if post.type == 'toggle':
            self.text = self.text + '<details>\n<summary>' + post.title + '</summary>\n'
            self.md_gen_util(post, depth)
            self.text = self.text + '</details>\n'
        else:
            self.md_gen_util(post, depth)

            
    def notion_to_md(self, blog_page_id):
        cv = self.client.get_collection_view(blog_page_id)
        posts = list(filter(lambda row: row.status == ['finished'], cv.collection.get_rows()))
        
        for post in posts:
            tags = post.get_property('Tags')
            tags_str = ' '.join(tags)
        
            self.text = """---\ntitle: %s\ntags: %s \n---\n""" % (post.title, tags_str)
            
            self.md_gen(post, depth = 0)
            
            title = post.title.replace(' ', '-')
            title = title.replace('—', '')
            title = title.replace('--', '-')
            title = title.replace(',', '')
            title = title.replace(';', '')
            title = title.replace('?', '')
            title = title.replace('%', '')
            title = title.replace('\'', '')
            title = title.replace('"', '')
            title = title.lower()
    
            folderpath = os.path.join(os.getcwd(), "_posts/")
            if not os.path.exists(folderpath):
                os.makedirs(folderpath)
                print('Created: %s', folderpath)
    
    
            with open(folderpath + post.get_property('Created').strftime("%Y-%m-%d") + "-" +
                                      title + ".md", 'w', encoding='utf-8') as file:
                file.write(self.text)
    
        
NotionJekyll()
