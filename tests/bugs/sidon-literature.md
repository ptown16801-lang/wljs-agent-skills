# Literature check: Sidon sets in Z_n with n = k² − k + 2

Date: 2026-10-22. Checked by an AI agent (literature search plus small Python computations). No human has reviewed this.

## Verdict: KNOWN

The claimed theorem has already been published. It appears with the same statement, the same parity-count proof, and the same link to relative difference sets in:

> M. Buratti and D. R. Stinson, *New results on modular Golomb rulers, optical orthogonal codes and related structures*, Ars Mathematica Contemporanea 20 (2021) 1–27, doi:10.26493/1855-3974.2374.9ff (published online 26 Nov 2020; arXiv:2007.01908).

Stronger results are also published, both earlier and later (details below). The corollary, including the least failure n = 22, can be read off directly from published tables and from the OEIS. Nothing in the claim is new.

Terminology: a Sidon set in Z_n in the difference sense with k elements is what that literature calls a **(n, k)-modular Golomb ruler (MGR)**. So s(n) ≥ k exactly when a (n, k)-MGR exists.

## Closest known results, with citations

### 1. Buratti–Stinson (2021): the exact theorem and proof

The numbering below is from the published AMC version. In arXiv v2 the same results are Theorem 3.6 and Corollary 3.7.

- **Theorem 3.1** says a (k²−k+2, k)-MGR is equivalent to a relative difference set in Z_{k²−k+2} relative to H = {0, (k²−k+2)/2}, the unique subgroup of order 2. This is the RDS lead.
- **Theorem 3.7** (with Lemma 3.6) covers v = k² − k + 2ℓ. The proof counts the even and odd elements: they are the roots of a quadratic x² − kx + (…) = 0, so its discriminant must be a perfect square. This is the claimed "parity count forces a square" argument.
- **Corollary 3.9** is the ℓ = 1 case and is word for word the claimed theorem: "If k ≡ 2, 3 (mod 4), then k − 2 is a perfect square." and "If k ≡ 0, 1 (mod 4), then k is a perfect square."
- **Corollary 3.4** gives stronger necessary conditions through the Bose–Connor theorem on square divisible designs (Bose & Connor, Ann. Math. Statist. 23 (1952) 367–383, as stated in Jungnickel, Canad. J. Math. 34 (1982), Prop. 1.8). For example, k ≢ 7 (mod 8), and for k ≡ 2 (mod 8), k must also be a sum of two squares. Remark 3.10 says Corollary 3.4 is stronger than Corollary 3.9.
- Section 3.1 says the only known (k²−k+2, k)-MGRs are the (8, 3) and (14, 4) rulers.
- **Theorem 2.3** lists exactly, from exhaustive search, the moduli for which a k-element MGR exists, for 3 ≤ k ≤ 11. For example MGR(5) = {21} ∪ {v ≥ 23}, MGR(6) = {31} ∪ {v ≥ 35} and MGR(7) = {v ≥ 48}. So n = 22 has no 5-element ruler, n = 32–34 have no 6-element ruler, and n = 43–47 have no 7-element ruler. Theorem 3.12 gives infinite families of whole intervals of v where no ruler exists.

### 2. Ryser (1973): the classical source of the square conditions

- H. J. Ryser, *Variants of cyclic difference sets*, Proc. Amer. Math. Soc. 41 (1973) 45–50, doi:10.1090/S0002-9939-1973-0317960-3.
- I learned what is in it secondhand, from Gordon (2025) below. Ryser calls cyclic RDS with n = 2 "near difference sets of type 1". His **Theorem 2.1**, as Gordon restates it: for a cyclic relative (v, 2, k, λ) difference set, "v even implies that k − 2λ is a perfect square". If v is odd, k is a perfect square, and a (v, k, 2λ)-difference set exists. With λ = 1 and v = m = (k²−k+2)/2, this is the claimed theorem. m is odd exactly when k ≡ 0, 1 (mod 4). So the result goes back at least to 1973.

### 3. Pott's survey: the same conditions for all abelian RDS

- A. Pott, *A survey on relative difference sets*, in: Groups, Difference Sets, and the Monster (de Gruyter, 1996), pp. 195–232.
- Gordon (2026, J. Algebraic Combin., below) quotes it as his Theorem 6. For an abelian (m, n, k, λ)-RDS: if m is even, then k − nλ is a square; if m is odd and n is even, then k is a square. With n = 2 and λ = 1 this is again the claimed theorem. The m-odd case is the standard real-character argument, and the claimed "parity count" is that same computation with χ(x) = (−1)^x.
- Arasu, Jungnickel, Ma and Pott, *Relative difference sets with n = 2*, Discrete Math. 147 (1995) 1–17, doi:10.1016/0012-365X(94)00226-9. This paper studies exactly these "liftings" of (m, k, 2λ)-difference sets. It proves that several families never lift, and conjectures that only liftings of Singer-complement parameters exist. (I read the abstract only.)

### 4. Gordon (2025): a much stronger statement

- D. M. Gordon, *Modular Golomb rulers and almost difference sets*, IEEE Trans. Inform. Theory 71(7) (2025) 5737–5743, doi:10.1109/TIT.2025.3566655 (arXiv:2408.16721).
- Section III, Theorem 9, restates the Buratti–Stinson RDS equivalence. Theorem 10 is Ryser's result. Projecting such an RDS onto Z_m gives a cyclic (m, k, 2) biplane difference set. Gordon then combines this with his own *On difference sets with small λ*, J. Algebraic Combin. 55 (2022) 109–115, Table 3, and with C. W. H. Lam, *On relative difference sets* (Proc. 7th Manitoba Conf., 1977), which shows that (11,5,2) and (37,9,2) do not lift. His conclusion: "there are no other (k² − k + 2, k)-MGRs with k ≤ 10^10".
- So s(k²−k+2) ≤ k − 1 is known for **every** 5 ≤ k ≤ 10^10. That includes the cases where the claimed theorem says nothing (k = 6, 9, 11, 16, 18, …). The only k with an MGR are 2, 3 and 4 (n = 4, 8, 14).
- Related: D. M. Gordon, *Cyclic relative difference sets and circulant weighing matrices*, J. Algebraic Combin. 63 (2026), article 24 (arXiv:2501.14924). Its Theorem 6 quotes Pott's square conditions.

### 5. OEIS and the sum formulation

- **OEIS A260999**: "Maximal size of a subset of Z_n with distinct sums of any two elements". Sloane, 2015; terms extended by Rob Pratt, 2017; b-file for n = 1..295. The sums allow repeated elements (bound C(a+1, 2) ≤ n), so these are B₂ sets. In an abelian group a B₂ set is the same thing as a difference-Sidon set, so A260999(n) = s(n). It cites Haanpää–Huima–Östergård (below).
  - My own exhaustive computation agrees with A260999 for every n from 2 to 60.
- **OEIS A004136** (Graham–Sloane v_δ): the least n such that a k-element set exists. Data 1, 3, 7, 13, 21, 31, 48, 57, 73, 91, 120, 133, … The entry calls these modular (circular) Golomb rulers. **A004135** is the version with sums of distinct elements only, which is a different problem.
- R. L. Graham and N. J. A. Sloane, *On additive bases and harmonious graphs*, SIAM J. Algebraic Discrete Methods 1 (1980) 382–404. This defines v_γ and v_δ. (Cited, not read.)
- H. Haanpää, A. Huima and P. R. J. Östergård, *Sets in Z_n with distinct sums of pairs*, Discrete Appl. Math. 138 (2004) 99–106. It computes v_δ(k) for k ≤ 14. (Abstract read; full text was refused, HTTP 403.)

## Is the corollary known?

- **Infinitely many n with s(n) < b(n): known in substance.** I did not find it stated in exactly these words, s(n) < b(n), but it follows at once from published results:
  - Ryser (1973) and Buratti–Stinson Corollary 3.9 each give infinitely many k with no (k²−k+2, k)-MGR, while b(k²−k+2) = k.
  - An older route: a (k²−k+1, k)-MGR is a cyclic projective plane of order k − 1 (Buratti–Stinson Theorem 1.1). The Bruck–Ryser–Chowla theorem (1949/50) rules out infinitely many orders, such as 6, 14, 21, 22, … That gives failures at n = 43, 211, …, which do appear in A260999.
  - Buratti–Stinson's Theorem 3.12 and Theorem 2.3 also give whole intervals of failures.
- **The least failure is n = 22: known.** It follows from Buratti–Stinson Theorem 2.3: MGR(3) and MGR(4) cover everything from 7 and from 13 upward, and MGR(5) misses 22. It is also visible in the A260999 data, where a(22) = 4 and b(22) = 5.
- **The failures up to 40 are exactly 22, 32, 33, 34: known** (Theorem 2.3, items 3–4, and A260999). My computation agrees.

## Independent checks I ran (Python only, no Wolfram)

Scripts are in `<scratch>/litsearch/`.

- **Exhaustive s(n) for 2 ≤ n ≤ 60.** Failures: 22, 32, 33, 34, 43–47, 58–60. All values agree with A260999.
- **Direct search for a k-element Sidon set modulo k² − k + 2.**

  | k | n | Result |
  |---|---|---|
  | 3 | 8 | found {0, 1, 3} |
  | 4 | 14 | found {0, 1, 4, 6} |
  | 5 | 22 | none |
  | 6 | 32 | none |
  | 7 | 44 | none |
  | 8 | 58 | none |
  | 9 | 74 | none |

- **A260999 b-file, k = 2..17.** At n = k² − k + 2, every k ≥ 5 fails. That includes the k the claimed theorem does not cover (6, 9, 11, 16), as Gordon's result predicts. The claimed theorem's condition never wrongly predicts a failure.
- I did not use the optional local Wolfram kernel. Python was enough, and it avoided any risk of contacting Wolfram.

## What I could not access or verify directly

- **Not read directly:** Ryser 1973 (AMS page refused, HTTP 403), Pott's 1996 survey, Elliott–Butson 1966, Bose–Connor 1952, Graham–Sloane 1980, the full text of Haanpää–Huima–Östergård 2004 (Aalto repository refused, HTTP 403), and the full text of Arasu–Jungnickel–Ma–Pott (abstract only). The statements and theorem numbers for Ryser (Theorem 2.1) and Pott (Gordon's "Theorem 6") come from Gordon's papers.
- **Read in full text:** Buratti–Stinson (the published AMC PDF and arXiv v2) and Gordon (arXiv:2408.16721v3, and the arXiv HTML of 2501.14924v2).
- **Not checked:** whether the IEEE published version of Gordon (2025) keeps the same theorem numbers 9 and 10; I read arXiv v3.
- No Wolfram site was accessed.

## Summary

The claimed theorem is **already known**. It is Corollary 3.9 of Buratti–Stinson (Ars Math. Contemp. 2021), with the same parity proof (Theorem 3.7) and the same relative-difference-set equivalence (Theorem 3.1). The square conditions themselves go back to Ryser (1973, Theorem 2.1) and are standard for abelian relative difference sets (Pott's 1996 survey).

A stronger result is also published. Gordon (IEEE Trans. IT 2025) shows that no (k²−k+2, k)-MGR exists for any 5 ≤ k ≤ 10^10. The corollary is known too: infinitely many failures follow immediately, and the least failure n = 22 and the failure list up to 40 are in Buratti–Stinson Theorem 2.3 and in OEIS A260999, which equals s(n).
