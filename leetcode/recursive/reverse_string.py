from typing import List


class Solution:
    def reverseString(self, s: List[str]) -> None:
        """
        Do not return anything, modify s in-place instead.
        """
        s = s.reverse()
        # if len(s) <= 1:
        #     return

        # s[0], s[-1] = s[-1], s[0]
        # s[1:-1] = self.reverseString(s[1:-1])


solution = Solution()
s = ['h', 'e', 'l', 'l', 'o']
solution.reverseString(s)
print(s)
