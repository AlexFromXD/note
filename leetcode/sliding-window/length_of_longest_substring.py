# https://leetcode.com/problems/longest-substring-without-repeating-characters

class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        """
        :type s: str
        :rtype: int
        """
        dict = {}
        ret = 0
        flag = 0
        for i in range(len(s)):
            if s[i] in dict:
                flag = max(flag, dict[s[i]]+1)
            dict[s[i]] = i
            ret = max(ret, i-flag+1)
        return ret


solution = Solution()
assert solution.lengthOfLongestSubstring('abbcd') == 3
assert solution.lengthOfLongestSubstring('abcabcbb') == 3
assert solution.lengthOfLongestSubstring('bbbbb') == 1
assert solution.lengthOfLongestSubstring('pwwkew') == 3
print("== done ==")
