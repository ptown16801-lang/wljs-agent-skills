# Independent check request: a parity obstruction for Sidon sets in cyclic groups

**What this is.** On 22 Oct 2026 an AI agent (Claude), testing a "write a research paper notebook" skill, wrote a short
paper about Sidon sets in Z_n and included a theorem it proved itself. This file contains everything needed to check
that work independently: the exact statements and proofs as written, all computational evidence so far, the scripts,
and what is still open. Please check it without trusting any of the claims below.

**What we want from you.**
1. **Proofs:** read each proof line by line. For every step say *valid*, *gap* (missing justification; say what is
   missing) or *wrong* (give a counterexample or the correct statement). Pay most attention to Theorem 2 (the parity
   theorem) and Corollary 3.
2. **Computation:** reproduce the numbers in §5 with your own code (do not just run ours), and extend them if you can
   (e.g. s(n) for n ≤ 60; the k = 9 case at n = 74).
3. **Novelty:** say whether Theorem 2 / Corollary 3 are already known (see §6 for leads). A separate literature search
   is running; its report will be in `../sidon-literature.md` if you want to compare.
4. Write your verdict as `CHECK-REPORT.md` next to this file: per statement *correct / correct with gap / wrong*,
   per number *reproduced / not reproduced*, and novelty *known (citation) / apparently new / undetermined*.

**Ground rules for the checker on this computer:** do not contact any Wolfram server (wolfram.com, MathWorld,
Wolfram|Alpha, Wolfram Cloud); a local Wolfram kernel may be used only inside the network cut
(`timeout 300 bwrap --unshare-net --unshare-pid --die-with-parent --dev-bind / / --proc /proc wolframscript -f FILE`,
first line `$AllowInternet = False;`). Python is fine. Install nothing; write only in this folder.

---

## 1. Definitions and notation

- For an integer n ≥ 2, a subset A ⊆ Z_n is a **Sidon set** if the differences a − a', taken over all *ordered* pairs
  (a, a') of *distinct* elements of A, are pairwise distinct in Z_n.
- s(n) = the largest size of a Sidon set in Z_n (well defined: singletons are Sidon, Z_n is finite).
- b(n) = ⌊(1 + √(4n − 3)) / 2⌋.

Note the convention: ordered pairs, so a k-element Sidon set has k(k − 1) distinct nonzero differences. (Some
literature calls these "modular Golomb rulers" / "planar" or "(v, k, 1) difference families" when the count is exact.)

## 2. Statements and proofs (verbatim content of the paper, notebook markup removed)

### Theorem 1 (counting bound)
Let n ≥ 2. Every Sidon set A ⊆ Z_n satisfies |A|(|A| − 1) ≤ n − 1, and consequently s(n) ≤ b(n).

*Proof.* Let k = |A|. There are k(k − 1) ordered pairs (a, a') of distinct elements; each difference is nonzero since
a ≠ a', and the differences are pairwise distinct by definition. So they are k(k − 1) distinct elements of the n − 1
nonzero residues: k(k − 1) ≤ n − 1, i.e. k² − k − (n − 1) ≤ 0. The roots of x² − x − (n − 1) are (1 ± √(4n − 3))/2,
the smaller negative since 4n − 3 > 1; a quadratic with positive leading coefficient is ≤ 0 exactly between its roots,
so 0 ≤ k ≤ (1 + √(4n − 3))/2 and, k being an integer, k ≤ b(n). Apply to a set of size s(n). ∎

### Lemma (ruler lemma)
Let L ≥ 0 and R ⊆ {0, 1, …, L} be a set of integers whose differences r − r' over pairs with r > r' are pairwise
distinct. Then for every n ≥ 2L + 1 the image of R in Z_n is a Sidon set with |R| elements.

*Proof.* Two elements of R differ by at most L < n, so reduction mod n is injective on R and ordered pairs of distinct
elements correspond. Take two different ordered pairs (r₁, r₁'), (r₂, r₂') of distinct elements, d_i = r_i − r_i' ∈
{−L, …, L} \ {0}. Both positive: d₁ ≠ d₂ by hypothesis. Both negative: −d₁, −d₂ are the differences of the different
pairs (r₁', r₁), (r₂', r₂) whose first entries are larger, so −d₁ ≠ −d₂. Opposite signs: d₁ ≠ d₂. In every case
0 < |d₁ − d₂| ≤ 2L < n, so the differences are distinct mod n. ∎

### Proposition (attainment for small n)
For every n with 2 ≤ n ≤ 21, s(n) = b(n).

*Proof.* By Theorem 1 it suffices to exhibit a Sidon set of size b(n). For k ≥ 1, b(n) = k exactly when
2k − 1 ≤ √(4n − 3) < 2k + 1, i.e. k² − k + 1 ≤ n ≤ k² + k. So b(2) = 1, b = 2 on 3..6, b = 3 on 7..12, b = 4 on
13..20, b(21) = 5. n = 2: {0}. The sets {0,1}, {0,1,3}, {0,1,4,6} have pairwise distinct positive differences (1; 1,3,2;
1,4,6,3,5,2) and L = 1, 3, 6, so by the Lemma they are Sidon in Z_n for n ≥ 3, n ≥ 7, n ≥ 13 respectively, covering
3 ≤ n ≤ 20. n = 21: A = {0, 1, 4, 14, 16}; its ten positive integer differences 1, 4, 14, 16, 3, 13, 15, 10, 12, 2 and
their negatives mod 21 (20, 17, 7, 5, 18, 8, 6, 11, 9, 19) are 1..20 in some order, so A is Sidon of size 5. ∎

### Theorem 2 (parity obstruction) — the new claim
Let k ≥ 2 and n = k² − k + 2. Suppose either
- k ≡ 0 or 1 (mod 4) and k is not a perfect square, or
- k ≡ 2 or 3 (mod 4) and k − 2 is not a perfect square.

Then b(n) = k and s(n) ≤ k − 1.

*Proof.* 4n − 3 = 4k² − 4k + 5 and, for k ≥ 2, (2k − 1)² < 4k² − 4k + 5 < (2k + 1)², so b(n) = k.

Suppose A ⊆ Z_n is Sidon with |A| = k. k(k − 1) is even, so n is even; write n = 2m, m = k(k − 1)/2 + 1. Let D be the
set of differences over ordered pairs of distinct elements; as in Theorem 1, |D| = k(k − 1) = n − 2. m ∉ D: if
a − a' = m then a' − a = −m = m, two different ordered pairs with equal difference. So D ⊆ Z_n \ {0, m} with n − 2
elements, hence D = Z_n \ {0, m}.

n is even, so parity is well defined in Z_n. Let e, o be the numbers of even and odd elements of A (e + o = k). a − a'
is odd exactly when a, a' have different parities, so D has exactly 2eo odd elements. Z_n has m odd elements, 0 is not
one, and m is one exactly when m is odd. With ε = 1 if m is odd, ε = 0 if m is even, Z_n \ {0, m} has m − ε odd
elements, so 2eo = m − ε. Using 4eo = k² − (e − o)²:

  (e − o)² = k² − 2(m − ε) = k² − k(k − 1) − 2 + 2ε = k − 2 + 2ε.

m − 1 = k(k − 1)/2 is even exactly when 4 | k(k − 1), i.e. k ≡ 0, 1 (mod 4). Hence ε = 1 and (e − o)² = k when
k ≡ 0, 1 (mod 4); ε = 0 and (e − o)² = k − 2 when k ≡ 2, 3 (mod 4). The hypothesis says this is not a perfect square:
contradiction. So s(n) ≤ k − 1. ∎

### Corollary 3
The set of n ≥ 2 with s(n) < b(n) is infinite; its least element is 22, and s(22) = 4.

*Proof.* For k ≥ 5 with k ≡ 5 (mod 8) (so k ≡ 1 mod 4), k is not a square because squares are ≡ 0, 1, 4 (mod 8);
Theorem 2 gives s(k² − k + 2) < b(k² − k + 2), and k ↦ k² − k + 2 is strictly increasing, giving infinitely many n.
The Proposition gives s(n) = b(n) for 2 ≤ n ≤ 21; Theorem 2 with k = 5 gives s(22) ≤ 4 < 5 = b(22); and {0, 1, 4, 6}
is Sidon in Z₂₂ by the Lemma (L = 6, 22 ≥ 13), so s(22) = 4. ∎

### Open question (stated in the paper)
For which k ≥ 2 outside Theorem 2's hypothesis does Z_{k² − k + 2} contain a Sidon set of size k? Yes for k = 3, 4
({0,1,3} in Z₈, {0,1,4,6} in Z₁₄); no for k = 6 (n = 32, by search). First open case k = 9, n = 74.

Not part of the claims (marked "retained, unverified" in the paper): a hedged claim that b is attained at
n = k² − k + 1 exactly when k − 1 is a prime power (checked only for 3 ≤ k ≤ 7), and a reference to Singer's theorem
that was not read.

## 3. Pre-check by the orchestrator (not independent)

The orchestrating session read the proofs once and found no gap; in particular it re-derived
(e − o)² = k − 2 + 2ε and the mod-4 case split, and the mod-8 fact. Treat this as a first reading only.

**Independent reading (Level C reviewer D, Oct 22):** read Theorem 2, Corollary 3, the ruler lemma and the n <= 21
proposition line by line and found them correct; its Python search also confirms failures exactly {22, 32, 33, 34} for
n <= 40, s(43) = 6, and no 7-set in Z_44 / 8-set in Z_58 (`../../levelC/review-D.md`).

## 4. Which n Theorem 2 covers (for orientation)

k = 2..20, condition true for k ∈ {5, 7, 8, 10, 12, 13, 14, 15, 17, 19, 20} → n = 22, 44, 58, 92, 134, 158, 184, 212,
274, 344, 382 (from the paper's own Wolfram expression; please recompute). k = 6 (n = 32): k − 2 = 4 is a square, so
the theorem is silent, yet a search says s(32) = 5 < 6.

## 5. Computational evidence so far

| Claim | Agent's check (Wolfram, WLJS kernel) | Orchestrator's independent check (Python) |
|---|---|---|
| s(n) = b(n) for 2 ≤ n ≤ 40 except n = 22, 32, 33, 34 (where s = b − 1) | backtracking search; a second subset search agrees for n ≤ 26 | `search_sidon_mod_n.py`: failures exactly [22, 32, 33, 34] |
| no 7-element Sidon set in Z₄₄ (k = 7) | backtracking, ~3 s | confirmed: none |
| no 8-element Sidon set in Z₅₈ (k = 8) | backtracking, ~36 s | confirmed: none |
| no 5-element Sidon set in Z₂₂ | (case k = 5) | confirmed earlier in the day: none of the 5,985 5-subsets of Z₂₂ containing 0 is Sidon; {0,1,3,7} is a 4-element one |
| k = 9, n = 74 | search did not finish in 90 s | not run |

Both searches fix 0 ∈ A (translation invariance).

Files in this folder:
- `search_sidon_mod_n.py` — the orchestrator's backtracking search (Python, no dependencies).
- The paper itself (source Markdown with Wolfram code):
  `../../runs/2026-10-22/paper-create-notebook/work/project/Research/Artifacts/SidonBoundFailsInfinitelyOften_261022.md`
  (its "Initialization" section has the agent's Wolfram search functions `SidonPaper`hasSidonK`, `maxSizeBT`).

## 6. Novelty: answered by the literature search (Oct 22; see `../sidon-literature.md`)

**Known.** Theorem 2 is Corollary 3.9 of M. Buratti and D. R. Stinson, "New results on modular Golomb rulers,
optical orthogonal codes and related structures", Ars Math. Contemp. 20 (2021) 1-27, arXiv:2007.01908 (same parity
argument, their Theorem 3.7). D. M. Gordon, "Modular Golomb rulers and almost difference sets", IEEE Trans. Inform.
Theory 71 (2025), arXiv:2408.16721, shows no (k^2-k+2, k) modular Golomb ruler exists for 5 <= k <= 10^10. s(n) is
OEIS A260999 (orchestrator checked: terms match the failures at 22, 32, 33, 34). Both arXiv records were checked by
the orchestrator (titles, authors). The checker can still verify the proof; the novelty question is settled.

### Original leads

A k-subset of Z_{2m} whose differences are exactly Z_{2m} \ {0, m} is a cyclic **relative difference set** with
parameters (m, 2, k, 1) relative to the subgroup {0, m} (equivalently a "near-perfect" / "almost perfect" modular
ruler). Such objects are classical (Butson; Elliott–Butson 1966; Jungnickel; Pott's book *Finite Geometry and Character
Theory*; Arasu–Jungnickel–Ma–Pott), and necessary conditions of "must be a square" type are standard there. Theorem 2
may well be a special case of a known result. Other names to search: modular Golomb rulers, optimal Sidon sets in
cyclic groups, Graham–Sloane, Haanpää–Huhtonen–Östergård. Do not use MathWorld (Wolfram site).
