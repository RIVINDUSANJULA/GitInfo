
import sys

path = 'components/builder/BuilderSidebar.tsx'
with open(path, 'r') as f:
    lines = f.readlines()

# Fix line 722 corruption (if it still exists or was partially fixed)
for i, line in enumerate(lines):
    if 'Master Skill Library' in line and '<div' in line and '</span>' not in line:
        lines[i] = line.replace('Master Skill Library', 'Master Skill Library</span>\n                                    ')
        print(f"Fixed line {i+1}")

# Fix trailing tags (888-892)
# We look for the specific sequence
start_idx = -1
for i in range(len(lines)-5):
    if '</motion.div>' in lines[i+887-887] and '</div>' in lines[i+888-887] and 'LayoutGroup' in lines[i+890-887]:
        # This is approximate, let's use the actual content from cat -e
        pass

# Better approach: find the Skill Badges section and re-balance it
# Or just find the lines that cat -e showed us

target_sequence = [
    '                          </motion.div>\n',
    '                        </div>\n',
    '                      </LayoutGroup>\n',
    '                    </motion.div>\n',
    '                  )}\n'
]

replacement_sequence = [
    '                            </div>\n',
    '                          </LayoutGroup>\n',
    '                        </motion.div>\n',
    '                      )}\n'
]

# Find the sequence
for i in range(len(lines) - len(target_sequence)):
    if all(lines[i+j].strip() == target_sequence[j].strip() for j in range(len(target_sequence))):
        lines[i:i+len(target_sequence)] = replacement_sequence
        print(f"Replaced sequence at line {i+1}")
        break

with open(path, 'w') as f:
    f.writelines(lines)
