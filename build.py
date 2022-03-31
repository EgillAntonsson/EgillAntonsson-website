import sys
import os
import subprocess
import shutil

print('Building with ng')
subprocess.run(["ng", "build", "--configuration", "production"], shell=True)
print('----------')


root_src_dir = 'dist\\'
root_dst_dir = 'deploy\\'
# hashedFileNames = ['main', 'polyfills', 'runtime', 'styles']

doNotRemoveFiles = ['_redirects', 'robots.txt', 'sitemap.xml']

print('Updating files to dir {:s}'.format(root_dst_dir))

# Removing files expect in dst_dir
for dirpath, _, filenames in os.walk(root_dst_dir):
	for filename in filenames:
		doNotRemove = False
		for fn in doNotRemoveFiles:
			if fn == filename:
				doNotRemove = True
				break
		if not doNotRemove:
			os.remove(os.path.join(dirpath, filename))

# Copy scr_dir and paste & replace to dst_dir
for src_dir, dirs, files in os.walk(root_src_dir):
	dst_dir = src_dir.replace(root_src_dir, root_dst_dir, 1)
	if not os.path.exists(dst_dir):
		os.makedirs(dst_dir)
	for file in files:
		src_file = os.path.join(src_dir, file)
		dst_file = os.path.join(dst_dir, file)
		if os.path.exists(dst_file):
			os.remove(dst_file)
		shutil.copy2(src_file, dst_dir)
