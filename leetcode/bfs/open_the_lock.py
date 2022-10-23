# https: // leetcode.com/problems/open-the-lock/


from collections import deque
from typing import List


class Solution:
    def openLock(self, deadends: List[str], target: str) -> int:
        dead = set(deadends)
        if "0000" in dead:
            return -1

        queue = deque([(0, "0000")])
        while queue:
            steps, code = queue.popleft()
            if code == target:
                return steps

            # deque([(1, '9000')])
            # deque([(1, '9000'), (1, '1000')])
            # deque([(1, '9000'), (1, '1000'), (1, '0900')])
            # deque([(1, '9000'), (1, '1000'), (1, '0900'), (1, '0100')])
            # deque([(1, '9000'), (1, '1000'), (1, '0900'), (1, '0100'), (1, '0090')])
            # deque([(1, '9000'), (1, '1000'), (1, '0900'), (1, '0100'), (1, '0090'), (1, '0010')])
            # deque([(1, '9000'), (1, '1000'), (1, '0900'), (1, '0100'), (1, '0090'), (1, '0010'), (1, '0009')])
            # deque([(1, '9000'), (1, '1000'), (1, '0900'), (1, '0100'), (1, '0090'), (1, '0010'), (1, '0009'), (1, '0001')])
            for i in range(4):
                d = int(code[i])
                # string to int, turn left or right
                for k in (d-1) % 10, (d+1) % 10:
                    # concat
                    cand = code[:i] + str(k) + code[i+1:]
                    if cand not in dead:
                        dead.add(cand)
                        queue.append((steps+1, cand))

        return -1


solution = Solution()

assert solution.openLock(["0201", "0101", "0102", "1212", "2002"], "0202") == 6
assert solution.openLock(["8888"], "0009") == 1
assert solution.openLock(
    ["8887", "8889", "8878", "8898", "8788", "8988", "7888", "9888"], "8888") == -1
