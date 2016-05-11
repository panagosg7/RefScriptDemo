
/*@ builtin_BIBracketRef :: <A>(x: UArray<A> , n: idx<x>)  => A */
/*@ builtin_BIBracketRef :: <A>(x: IArray<A> , n: idx<x>)  => A */
/*@ builtin_BIBracketRef :: <A>(x: MArray<A> , n: number)  => A + undefined */
/*@ builtin_BIBracketRef :: <A>(x: {[y: string]: A }, s: string)
    => { A + undefined | (hasProperty x s) => (ttag v != "undefined") } */
declare function builtin_BIBracketRef(a: any, n: any): any;

/*@ builtin_BIBracketAssign :: <A>(x: UArray<A> , n: idx<x>, v: A) => void */
/*@ builtin_BIBracketAssign :: <A>(x: MArray<A> , n: number, v: A) => void */
/*@ builtin_BIBracketAssign :: <A>(a: {[y: string]: A}, s: string, v: A) => void */
declare function builtin_BIBracketAssign<A>(a: any, s: any, v: A): void;

/*@ builtin_BIImmArrayLit :: <A>(x: A) => {v: IArray<A> | len v = builtin_BINumArgs } */
declare function builtin_BIImmArrayLit<A>(a: A): A[];

declare function builtin_BIUniqueArrayLit<A>(a: A): Array<Unique, A>;

declare function builtin_BIArrayLit<M extends ReadOnly, A>(a: A): Array<M, A>;

/*@ builtin_BICondExpr :: <C, A, B>(c: C, x: A, y: B) => { v: any | if Prop(c) then v ~~ x else v ~~ y } */
declare function builtin_BICondExpr<C, A, B>(c: C, x: A, y: B): any;

/*@ builtin_OpLT :: (x:number, y:number) => {v:boolean | Prop v <=> x < y } */
/*@ builtin_OpLT :: <T>(x:T, y:T) => boolean */
declare function builtin_OpLT(a: any, b: any): boolean;

/*@ builtin_OpLEq ::    (x:number, y:number) => {v:boolean | Prop v <=> x <= y } */
/*@ builtin_OpLEq :: <T>(x:T, y:T) => boolean */
declare function builtin_OpLEq(a: any, b: any): boolean;

/*@ builtin_OpGT ::    (x:number, y:number) => {v:boolean | Prop v <=> x > y } */
/*@ builtin_OpGT :: <T>(x:T, y:T) => boolean */
declare function builtin_OpGT(a: any, b: any): boolean;

/*@ builtin_OpGEq :: (x:number, y:number) => {v:boolean | Prop v <=> x >= y } */
/*@ builtin_OpGEq :: <T>(x:T, y:T) => boolean */
declare function builtin_OpGEq(a: any, b: any): boolean;

/*@ builtin_OpAdd :: (x: number     , y: number     ) => {number | v = x + y} */
/*@ builtin_OpAdd :: (x: real       , y: real       ) => {real   | v = x + y} */
/*@ builtin_OpAdd :: (x: bitvector32, y: bitvector32) => bitvector32          */
/*@ builtin_OpAdd :: (x: number     , y: string     ) => string               */
/*@ builtin_OpAdd :: (x: string     , y: number     ) => string               */
/*@ builtin_OpAdd :: (x: string     , y: string     ) => string               */
/*@ builtin_OpAdd :: (x: string     , y: boolean    ) => string               */
/*@ builtin_OpAdd :: (x: boolean    , y: string     ) => string               */
declare function builtin_OpAdd(a: any, b: any): any;

/*@ builtin_OpSub :: (x:number, y:number)  => {v:number | v ~~ x - y} */
declare function builtin_OpSub(a: number, b: number): number;

/*@ builtin_OpMul ::
    (x: real, y: real) => { v: real | v = x * y } */

/*@ builtin_OpMul ::
    (x: number, y: number) => { v:number | [ v = x * y ;
                                            (x > 0 && y > 0) => v > 0 ;
                                            (x < 0 && y < 0) => v > 0 ;
                                            (x = 0 || y = 0) => v = 0 ] }
 */
declare function builtin_OpMul(a: number, b: number): number;

/*@ builtin_OpDiv :: (x: number, y: { number | v != 0}) => {v:number | (x > 0 && y > 1) => (0 <= v && v < x)} */
declare function builtin_OpDiv(a: number, b: number): number;

declare function builtin_OpMod(a: number, b: number): number;

/*@ builtin_PrefixPlus :: (x:number) => { v:number  | v ~~ x } */
declare function builtin_PrefixPlus(a: number): number;

/*@ builtin_PrefixMinus :: (x :number) => {v:number  | v = 0 - x} */
declare function builtin_PrefixMinus(a: number): number;

/*@ builtin_OpSEq :: <A>  (x:A, y:A) => {v:boolean | Prop v <=> x ~~ y } */
/*@ builtin_OpSEq :: <A,B>(x:A, y:B) => {v:boolean | not (Prop v) } */
declare function builtin_OpSEq<A,B>(x: A, y: B): boolean;

/*@ builtin_OpSNEq :: <A>  (x:A, y:A) => {v:boolean | Prop v <=> not (x ~~ y) } */
/*@ builtin_OpSNEq :: <A,B>(x:A, y:B) => {v:boolean | Prop v } */
declare function builtin_OpSNEq<A,B>(x: A, y: B): boolean;

/*@ builtin_PrefixLNot :: <A>(x: A) => {v:boolean | Prop v <=> not (Prop x) } */
declare function builtin_PrefixLNot<A>(x: A): boolean;

/*@ builtin_OpLAnd ::<B>(x: undefined, y:B) => undefined */
/*@ builtin_OpLAnd ::<B>(x: null, y:B) => null */
/*@ builtin_OpLAnd ::<A>(x:A, y:A) => { v:A | if (Prop x) then (v = y) else (v = x) } */
/*@ builtin_OpLAnd ::<A,B>(x:A, y:B) => { v:top | Prop v <=> (Prop x && Prop y) } */
declare function builtin_OpLAnd(x: any, y: any): any;

// /*@ builtin_PrefixBNot ::
//     (x: number) => {v:number | v = 0 - (x + 1) }
//  */
// declare function builtin_PrefixBNot(n: number): number;

/*@ builtin_OpBOr :: (x: bitvector32, y: bitvector32) => { v: bitvector32 | v = bvor x y } */
/*@ builtin_OpBOr :: <A>(x: A, y: A) => { v: A | if (Prop x) then (v = x) else (v = y) } */
declare function builtin_OpBOr(x: number, y: number): number;

// declare function builtin_OpBXor(a: number, b: number): number;

/*@ builtin_OpBAnd :: (a: bitvector32, b: bitvector32) => { v: bitvector32 | v = bvand a b } */
declare function builtin_OpBAnd(a: number, b: number): number;

declare function builtin_OpLShift(a: number, b: number): number;


/*@ builtin_OpSpRShift :: (a: { number | v >= 0 }, b: { number | v >= 0}) => { number | v >= 0 } */
declare function builtin_OpSpRShift(a: number, b: number): number;
// declare function builtin_OpZfRShift(a: number, b: number): number;
//
// /*   predicate bv_truthy(b) = (b /= (lit "#x00000000" (BitVec Size32))) */

declare function builtin_BICtorExit(): void;

// RUN-TIME TAGS

/*@ builtin_PrefixTypeof :: <A>(x:A) => { v:string | ttag x = v } */
declare function builtin_PrefixTypeof<A>(x: A): string;

/*@ builtin_BITruthy :: (b: bitvector32) => { v: boolean | Prop v <=> b /= lit "#x00000000" (BitVec Size32) } */
/*@ builtin_BITruthy :: <A>(x:A)         => { v: boolean | Prop v <=> Prop x } */
declare function builtin_BITruthy<A>(x: A): boolean;

/*@ builtin_BIFalsy  :: <A>(x:A) => { v:boolean | Prop v <=> not (Prop x) } */
declare function builtin_BIFalsy<A>(x: A): boolean;


/*@ builtin_BIForInKeys :: <A>(a: IArray<A>) => IArray<idx<a>> */
/*@ builtin_BIForInKeys ::    (o: { }      ) => IArray<{ string | (hasProperty o v) && (enumProp o v) }> */
declare function builtin_BIForInKeys(obj: Object): string[];


// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...in
//TODO: remove the last overload once {[s:string]:A} extends { } PV: ???

/*@ builtin_BIForInKeys :: <A>(a: IArray<A>)                    => IArray<{ number | 0 <= v && v < len a }> */
/*@ builtin_BIForInKeys ::    (o: Object<Immutable>)            => IArray<{ string | hasProperty o v && enumProp o v }> */
/*@ builtin_BIForInKeys ::    (o: (Immutable) { })              => IArray<{ string | hasProperty o v && enumProp o v }> */
/*@ builtin_BIForInKeys :: <A>(o: (Immutable) { [s:string]:A }) => IArray<{ string | hasProperty o v && enumProp o v }> */
declare function builtin_BIForInKeys(obj: Object): string[];

/*@ builtin_OpInstanceof :: <A>(x:A, s: string) => { v: boolean | Prop v <=> extends_class(x, s) } */
declare function builtin_OpInstanceof<A>(x: A, s: string): boolean;

/*@ builtin_OpIn :: <A>(i: number, a: IArray<A>) => { v: boolean | Prop v <=> (0 <= i && i < len a) } */
/*@ builtin_OpIn ::    (s: string, o: { }      ) => { v: boolean | Prop v <=> hasProperty o s }        */
declare function builtin_OpIn(s: string, obj: Object): boolean;


// INVARIANTS

/*@ invariant {v: undefined | [(ttag(v) = "undefined"); not (Prop v) ]} */
/*@ invariant {v: null      | [(ttag(v) = "object"   ); not (Prop v) ]} */
/*@ invariant {v: boolean   | [(ttag(v) = "boolean"  )]} */
/*@ invariant {v: string    | [(ttag(v) = "string"   ); (Prop(v) <=> v /= "" )]} */
/*@ invariant {v: number    | [(ttag(v) = "number"   ); (Prop(v) <=> v /= 0  )]}	*/

// GENERAL PURPOSE AUXILIARY DEFINITIONS

/*@ crash :: <A>() => A */
declare function crash(): any;

/*@ assume :: <A>(x: A) => {v:void | Prop x} */
declare function assume<A>(x: A): void;

/*@ assert :: <A>({A | Prop v}) => void */
declare function assert<A>(x: A): void;

declare function random(): number;

/*@ _pos :: () => posint */
declare function _pos(): posint;

declare function alert(s: string): void;

/*@ isNaN :: (x: undefined + number) => {v:boolean | Prop v <=> (ttag v != "number")} */
declare function isNaN(x:any) : boolean;

interface ReadOnly {
    _readOnnlyBrand: any;
}

interface AssignsFields extends ReadOnly {
    _assignsFieldsBrand: any;
}

interface Mutable extends AssignsFields {
    _mutableBrand: any;
}

interface Immutable extends ReadOnly {
    _immutableBrand: any;
}

interface Unique extends Immutable, Mutable {
    _uniqueBrand: any;
}

/*@ type idx<x> = { v: number | 0 <= v && v < len x } */
declare type idx = number;

/*@ type posint = { v: number | 0 < v } */
declare type posint = number;

/*@ type negint = { v: number | v < 0 } */
declare type negint = number;

/*@ qualif Bot  (v: a           ): 0 = 1        */
/*@ qualif Bot  (v: bool        ): 0 = 1        */
/*@ qualif CmpZ (v: int         ): v < 0        */
/*@ qualif Bot  (v: int         ): 0 = 1        */
/*@ qualif CmpZ (v: int         ): v <= 0       */
/*@ qualif CmpZ (v: int         ): v >  0       */
/*@ qualif CmpZ (v: int         ): v >= 0       */
/*@ qualif CmpZ (v: int         ): v =  0       */
/*@ qualif CmpO (v: int         ): v =  1       */
/*@ qualif CmpZ (v: int         ): v != 0       */
/*@ qualif Cmp  (v: int , x: int): v <  x       */
/*@ qualif Cmp  (v: int , x: int): v <= x       */
/*@ qualif Cmp  (v: int , x: int): v >  x       */
/*@ qualif Cmp  (v: int , x: int): v >= x       */
/*@ qualif Cmp  (v: a   , x: a  ): v ~~ x       */
/*@ qualif Cmp  (v: a   , x: a  ): v != x       */
/*@ qualif True (v: a           ): (Prop v)     */
/*@ qualif False(v: a           ): not (Prop v) */
/*@ qualif Tag  (v: Str , x: a  ): v = ttag x   */
/*@ qualif Len  (v: int , x: a  ): v < len x    */

/*@ measure hasProperty         :: <A>  (x: A, p: string) => bool */
/*@ measure hasDirectProperty   :: <A>  (x: A, p: string) => bool */
/*@ measure enumProp            :: <A>  (x: A, p: string) => bool */
/*@ measure ttag                :: <A>  (x: A) => string          */
/*@ measure Prop                :: <A>  (x: A) => bool            */
/*@ measure extends_class       :: <A>  (x: A, c: string) => bool */
/*@ measure extends_interface   :: <A>  (x: A, i: string) => bool */
/*@ measure offset              :: <A,B>(x: A, y: string) => B    */
/*@ measure len                 :: <M,A>(x: Array<M,A>) => number */

/*@ undefined :: undefined */
declare let undefined;

/**
    https://github.com/Microsoft/TypeScript/blob/master/lib/lib.d.ts#L94
*/

interface Object {
    hasOwnProperty(v: string): boolean;
    toString(): string;
}

interface ObjectConstructor<M extends ReadOnly> {
    new (value?: any): Object;
    (): any;
    /*@ (value: string): string */
    (value: any): any;
    prototype: Object;
    /*@ getPrototypeOf(o: string): { string | v = "" }  */
    getPrototypeOf(o: any): any;
    getOwnPropertyDescriptor(o: any, p: string): PropertyDescriptor<M>;
    getOwnPropertyNames(o: any): string[];
    create(o: any, properties?: PropertyDescriptorMap<M>): any;
    defineProperty(o: any, p: string, attributes: PropertyDescriptor<M>): any;
    defineProperties(o: any, properties: PropertyDescriptorMap<M>): any;
    seal<T>(o: T): T;
    freeze<T>(o: T): T;
    preventExtensions<T>(o: T): T;
    isSealed(o: any): boolean;
    isFrozen(o: any): boolean;
    isExtensible(o: any): boolean;
    keys(o: any): string[];
}

declare let Object: ObjectConstructor<ReadOnly>;


interface PropertyDescriptor<M extends ReadOnly> {
    configurable?: boolean;
    enumerable?: boolean;
    value?: any;
    writable?: boolean;
    get?(): any;
    set?(v: any): void;
}

interface PropertyDescriptorMap<M extends ReadOnly> {
    [s: string]: PropertyDescriptor<ReadOnly>;
}

interface Array<M extends ReadOnly, T> {
    length: number;

    /*@ @Mutable push(x: T): number */
    push(x: T): number;
    // push<N>(...items: Array<T>): number;

    /*@ @Mutable pop(): T */
    pop(): T;

    /*@ @Immutable concat     (item: IArray<T> ): { IArray<T> | len v = len this + len item } */
    /*@            concat<M,N>(item: Array<M,T>):   Array<N,T> */
    concat(item: T[]): T[];
    // concat<U extends T[]>(...items: U[]): T[];
    // concat(...items: T[]): T[];

    /*@ @Mutable reverse(): Array<M, T> */
    reverse(): T[];

    // toString(): string;
    // toLocaleString(): string;
    // join(separator?: string): string;
    // shift(): T;

    slice(start?: number, end?: number): UArray<T>;

    /*@ sort(compareFn:(a:T,b:T)=>number) : Array<M,T> */
    sort(compareFn?: (a: T, b: T) => number): T[];
    // splice(start: number): T[];
    // splice(start: number, deleteCount: number, ...items: T[]): T[];
    // unshift(...items: T[]): number;
    // indexOf(searchElement: T, fromIndex?: number): number;
    // lastIndexOf(searchElement: T, fromIndex?: number): number;
    // every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
    // some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean;
    // forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void;

    /*@ map<U>(callbackfn: (value: T) => U): UArray<U> */
    /*@ map<U>(callbackfn: (value: T, index: number) => U): UArray<U> */
    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[];

    /*@ filter (callbackfn: (v: T) => boolean): UArray<T> */
    /*@ filter (callbackfn: (v: T, i: number) => boolean): UArray<T> */
    /*@ filter (callbackfn: (v: T, i: number, a: IArray<T>) => boolean): UArray<T> */
    filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[];

    // reduce(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T;

    /*@ @Immutable reduce<U>(callback: (x: U, y: T, n: idx<this>) => U, init: U): U */
    reduce<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;

    // reduceRight(callbackfn: (previousValue: T, currentValue: T, currentIndex: number, array: T[]) => T, initialValue?: T): T;
    // reduceRight<U>(callbackfn: (previousValue: U, currentValue: T, currentIndex: number, array: T[]) => U, initialValue: U): U;

    [n: number]: T;
}

declare type UArray<T>  = Array<Unique, T>;
declare type IArray<T>  = Array<Immutable, T>;
declare type MArray<T>  = Array<Mutable, T>;
declare type ROArray<T> = Array<ReadOnly, T>;


// XXX: Add Well formedness check for missing type params

/*@ builtin_BIGetLength ::                     <T>(a: IArray<T>) =>  { v: number | v >= 0 && v = len a } */
/*@ builtin_BIGetLength :: <M extends ReadOnly, T>(a: Array<M,T>) => { v: number | v >= 0 } */
declare function builtin_BIGetLength<M extends ReadOnly,T>(a: Array<M, T>): number;

interface ArrayConstructor<M extends ReadOnly> {
    // new (arrayLength?: number): any[];

    // XXX: Keep the array length refinement ???

    /*@ new <T>(arrayLength: number): { v: Array<Unique,T> | len v = arrayLength } */
    new <T>(arrayLength: number): Array<M,T>;

    // new <T>(...items: T[]): T[];
    // (arrayLength?: number): any[];
    // <T>(arrayLength: number): T[];
    // <T>(...items: T[]): T[];
    // isArray(arg: any): arg is Array<any>;
    // prototype: Array<any>;
}

declare let Array: ArrayConstructor<ReadOnly>;

/*@ type LList<M,T> = List<M,T> + null */
declare type LList<M,T> = any;

/*@ measure LLlen :: <A>(A) => number */

interface List<M extends ReadOnly, T> {
  data: T;
  /*@ next : LList<M, T> */
  next: List<M, T>;
}
/*@ empty :: <M extends ReadOnly, T> (a: LList<M,T>) => {boolean | ((Prop v) <=> not (Prop a)) && ((Prop v) <=> LLlen(a) = 0) } */
declare function empty<M extends ReadOnly, T>(a? : List<M,T>) : boolean;
declare function emptyPoly<M extends ReadOnly, T>(xs: List<M,T>):boolean;
declare function head<M extends ReadOnly, T>(a : List<M,T>) : T;
/*@ tail :: <M extends ReadOnly, T> (a: List<M,T>) => {LList<M,T> | LLlen(v) = LLlen(a) - 1} */
declare function tail<M extends ReadOnly, T>(a : List<M,T>) : List<M,T>;
/*@ nil :: () => {null | LLlen(v) = 0} */
declare function nil() : any;
/*@ cons :: <M extends ReadOnly, T> (hd:T, tl:LList<M,T>) => {LList<M,T> | LLlen(v) = LLlen(tl) + 1} */
declare function cons<M extends ReadOnly, T>(hd:T,tl?:List<M,T>):List<M,T>;
declare function safehead<M extends ReadOnly, T>(a : List<M,T>) : T;
/*@ safetail :: <M extends ReadOnly, T> (a: List<M,T>) => {LList<M,T> | LLlen(v) = LLlen(a) - 1} */
declare function safetail<M extends ReadOnly, T>(a : List<M,T>) : List<M,T>;
/*@ mylength :: <M extends ReadOnly, T> (a: LList<M,T>) => {number | v = LLlen(a)} */
declare function mylength<M extends ReadOnly, T>(a : List<M,T>) : number;

interface Boolean { }

/*** Function ************************************************************/

interface Function {

    apply(thisArg: any, argArray?: any): any;

    // TODO: restore when rest parameters are supported
    call(thisArg: any): any;
    call(thisArg: any, a1: any): any;
    call(thisArg: any, a1: any, a2: any): any;
    call(thisArg: any, a1: any, a2: any, a3: any): any;
    call(thisArg: any, a1: any, a2: any, a3: any, a4: any): any;
    call(thisArg: any, a1: any, a2: any, a3: any, a4: any, a5: any): any;
    call(thisArg: any, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any): any;
    call(thisArg: any, a1: any, a2: any, a3: any, a4: any, a5: any, a6: any, a7: any): any;

    // bind<M extends ReadOnly>(thisArg: any, ...argArray: Array<M, any>): any;

    prototype: any;
    length: number;

    // Non-standard extensions
    arguments: any;
    caller: Function;
}

declare let Function: {
    //new (...args: string[]): Function;
    //(...args: string[]): Function;
    prototype: Function;
}

interface String {
    /** Returns a string representation of a string. */
    toString(): string;

    /**
      * Returns the character at the specified index.
      * @param pos The zero-based index of the desired character.
      */
    charAt(pos: number): string;

    /**
      * Returns the Unicode value of the character at the specified location.
      * @param index The zero-based index of the desired character. If there is no character at the specified index, NaN is returned.
      */
    charCodeAt(index: number): number;

    // /**
    //   * Returns a string that contains the concatenation of two or more strings.
    //   * @param strings The strings to append to the end of the string.
    //   */
    // concat(...strings: string[]): string;
    //
    // /**
    //   * Returns the position of the first occurrence of a substring.
    //   * @param searchString The substring to search for in the string
    //   * @param position The index at which to begin searching the String object. If omitted, search starts at the beginning of the string.
    //   */
    // indexOf(searchString: string, position?: number): number;
    //
    // /**
    //   * Returns the last occurrence of a substring in the string.
    //   * @param searchString The substring to search for.
    //   * @param position The index at which to begin searching. If omitted, the search begins at the end of the string.
    //   */
    // lastIndexOf(searchString: string, position?: number): number;
    //
    // /**
    //   * Determines whether two strings are equivalent in the current locale.
    //   * @param that String to compare to target string
    //   */
    // localeCompare(that: string): number;
    //
    // /**
    //   * Matches a string with a regular expression, and returns an array containing the results of that search.
    //   * @param regexp A variable name or string literal containing the regular expression pattern and flags.
    //   */
    // match(regexp: string): RegExpMatchArray;
    //
    // /**
    //   * Matches a string with a regular expression, and returns an array containing the results of that search.
    //   * @param regexp A regular expression object that contains the regular expression pattern and applicable flags.
    //   */
    // match(regexp: RegExp): RegExpMatchArray;
    //
    // /**
    //   * Replaces text in a string, using a regular expression or search string.
    //   * @param searchValue A string that represents the regular expression.
    //   * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
    //   */
    // replace(searchValue: string, replaceValue: string): string;
    //
    // /**
    //   * Replaces text in a string, using a regular expression or search string.
    //   * @param searchValue A string that represents the regular expression.
    //   * @param replacer A function that returns the replacement text.
    //   */
    // replace(searchValue: string, replacer: (substring: string, ...args: any[]) => string): string;
    //
    // /**
    //   * Replaces text in a string, using a regular expression or search string.
    //   * @param searchValue A Regular Expression object containing the regular expression pattern and applicable flags.
    //   * @param replaceValue A string containing the text to replace for every successful match of searchValue in this string.
    //   */
    // replace(searchValue: RegExp, replaceValue: string): string;
    //
    // /**
    //   * Replaces text in a string, using a regular expression or search string.
    //   * @param searchValue A Regular Expression object containing the regular expression pattern and applicable flags
    //   * @param replacer A function that returns the replacement text.
    //   */
    // replace(searchValue: RegExp, replacer: (substring: string, ...args: any[]) => string): string;
    //
    // /**
    //   * Finds the first substring match in a regular expression search.
    //   * @param regexp The regular expression pattern and applicable flags.
    //   */
    // search(regexp: string): number;
    //
    // /**
    //   * Finds the first substring match in a regular expression search.
    //   * @param regexp The regular expression pattern and applicable flags.
    //   */
    // search(regexp: RegExp): number;
    //
    // /**
    //   * Returns a section of a string.
    //   * @param start The index to the beginning of the specified portion of stringObj.
    //   * @param end The index to the end of the specified portion of stringObj. The substring includes the characters up to, but not including, the character indicated by end.
    //   * If this value is not specified, the substring continues to the end of stringObj.
    //   */
    // slice(start?: number, end?: number): string;
    //
    // /**
    //   * Split a string into substrings using the specified separator and return them as an array.
    //   * @param separator A string that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.
    //   * @param limit A value used to limit the number of elements returned in the array.
    //   */
    // split(separator: string, limit?: number): string[];
    //
    // /**
    //   * Split a string into substrings using the specified separator and return them as an array.
    //   * @param separator A Regular Express that identifies character or characters to use in separating the string. If omitted, a single-element array containing the entire string is returned.
    //   * @param limit A value used to limit the number of elements returned in the array.
    //   */
    // split(separator: RegExp, limit?: number): string[];
    //
    // /**
    //   * Returns the substring at the specified location within a String object.
    //   * @param start The zero-based index number indicating the beginning of the substring.
    //   * @param end Zero-based index number indicating the end of the substring. The substring includes the characters up to, but not including, the character indicated by end.
    //   * If end is omitted, the characters from start through the end of the original string are returned.
    //   */
    // substring(start: number, end?: number): string;
    //
    // /** Converts all the alphabetic characters in a string to lowercase. */
    // toLowerCase(): string;
    //
    // /** Converts all alphabetic characters to lowercase, taking into account the host environment's current locale. */
    // toLocaleLowerCase(): string;
    //
    // /** Converts all the alphabetic characters in a string to uppercase. */
    // toUpperCase(): string;
    //
    // /** Returns a string where all alphabetic characters have been converted to uppercase, taking into account the host environment's current locale. */
    // toLocaleUpperCase(): string;
    //
    // /** Removes the leading and trailing white space and line terminator characters from a string. */
    // trim(): string;
    //
    // /** Returns the length of a String object. */
    // length: number;
    //
    // // IE extensions
    // /**
    //   * Gets a substring beginning at the specified location and having the specified length.
    //   * @param from The starting position of the desired substring. The index of the first character in the string is zero.
    //   * @param length The number of characters to include in the returned substring.
    //   */
    // substr(from: number, length?: number): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): string;

    [index: number]: string;
}

interface StringConstructor {
    new (value?: any): String;
    (value?: any): string;
    prototype: String;
    // fromCharCode(...codes: number[]): string;
}

/**
  * Allows manipulation and formatting of text strings and determination and location of substrings within strings.
  */
declare let String: StringConstructor;

/*@ measure numeric_nan               :: number */
/*@ measure numeric_max_value         :: number */
/*@ measure numeric_min_value         :: number */
/*@ measure numeric_negative_infinity :: number */
/*@ measure numeric_positive_infinity :: number */

/*@  NaN :: { number | v = numeric_nan } */
declare let NaN: number;

interface Number {
    /**
      * Returns a string representation of an object.
      * @param radix Specifies a radix for converting numeric values to strings. This value is only used for numbers.
      */
    toString(radix?: number): string;

    /**
      * Returns a string representing a number in fixed-point notation.
      * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
      */
    toFixed(fractionDigits?: number): string;

    /**
      * Returns a string containing a number represented in exponential notation.
      * @param fractionDigits Number of digits after the decimal point. Must be in the range 0 - 20, inclusive.
      */
    toExponential(fractionDigits?: number): string;

    /**
      * Returns a string containing a number represented either in exponential or fixed-point notation with a specified number of digits.
      * @param precision Number of significant digits. Must be in the range 1 - 21, inclusive.
      */
    toPrecision(precision?: number): string;

    /** Returns the primitive value of the specified object. */
    valueOf(): number;
}

interface NumberConstructor {
    new (value?: any): Number;
    (value?: any): number;
    prototype: Number;

    /** The largest number that can be represented in JavaScript. Equal to approximately 1.79E+308. */
    MAX_VALUE: number;

    /** The closest number to zero that can be represented in JavaScript. Equal to approximately 5.00E-324. */
    MIN_VALUE: number;

    /**
      * A value that is not a number.
      * In equality comparisons, NaN does not equal any value, including itself. To test whether a value is equivalent to NaN, use the isNaN function.
      */
    NaN: number;

    /**
      * A value that is less than the largest negative number that can be represented in JavaScript.
      * JavaScript displays NEGATIVE_INFINITY values as -infinity.
      */
    NEGATIVE_INFINITY: number;

    /**
      * A value greater than the largest number that can be represented in JavaScript.
      * JavaScript displays POSITIVE_INFINITY values as infinity.
      */
    POSITIVE_INFINITY: number;
}

/** An object that represents a number of any kind. All JavaScript numbers are 64-bit floating-point numbers. */
declare let Number: NumberConstructor;

interface IArguments {
    [index: number]: any;
    length: number;
    callee: Function;
}

interface RegExpExecArray extends IArray<string> {
    index: number;
    input: string;
}

interface RegExp {
    /**
      * Executes a search on a string using a regular expression pattern, and returns an array containing the results of that search.
      * @param string The String object or string literal on which to perform the search.
      */
    exec(string: string): RegExpExecArray;

    /**
      * Returns a Boolean value that indicates whether or not a pattern exists in a searched string.
      * @param string String on which to perform the search.
      */
    test(string: string): boolean;

    /** Returns a copy of the text of the regular expression pattern. Read-only. The regExp argument is a Regular expression object. It can be a variable name or a literal. */
    source: string;

    /** Returns a Boolean value indicating the state of the global flag (g) used with a regular expression. Default is false. Read-only. */
    global: boolean;

    /** Returns a Boolean value indicating the state of the ignoreCase flag (i) used with a regular expression. Default is false. Read-only. */
    ignoreCase: boolean;

    /** Returns a Boolean value indicating the state of the multiline flag (m) used with a regular expression. Default is false. Read-only. */
    multiline: boolean;

    lastIndex: number;

    // Non-standard extensions
    compile(): RegExp;
}

interface Error<M extends Immutable> {
    name: string;
    message: string;
}

interface ErrorConstructor<M extends Immutable> {
    new (message?: string): Error<M>;
    (message?: string): Error<M>;
    prototype: Error<M>;
}

declare let Error: ErrorConstructor<Immutable>;

/*** Console ************************************************************/
interface Console<M extends ReadOnly> {
    // info(message?: any, ...optionalParams: any[]): void;
    // warn(message?: any, ...optionalParams: any[]): void;
    // error(message?: any, ...optionalParams: any[]): void;
    log(message?: any): void; // TODO log(message?: any, ...optionalParams: any[]): void;
    profile(reportName?: string): void;
    // assert(test?: boolean, message?: string, ...optionalParams: any[]): void;
    //msIsIndependentlyComposed(element: Element): boolean;
    clear(): void;
    // dir(value?: any, ...optionalParams: any[]): void;
    profileEnd(): void;
    count(countTitle?: string): void;
    groupEnd(): void;
    time(timerName?: string): void;
    timeEnd(timerName?: string): void;
    trace(): void;
    group(groupTitle?: string): void;
    dirxml(value: any): void;
    // debug(message?: string, ...optionalParams: any[]): void;
    groupCollapsed(groupTitle?: string): void;
    //select(element: Element): void;
}
// interface ConsoleConstructor<M extends Immutable> {
//     prototype: Console<M>;
//     new(): Console<M>;
// }
declare let console: Console<Immutable>;

interface Math<M extends ReadOnly> {
    /** The mathematical constant e. This is Euler's number, the base of natural logarithms. */
    E: number;
    /** The natural logarithm of 10. */
    LN10: number;
    /** The natural logarithm of 2. */
    LN2: number;
    /** The base-2 logarithm of e. */
    LOG2E: number;
    /** The base-10 logarithm of e. */
    LOG10E: number;
    /** Pi. This is the ratio of the circumference of a circle to its diameter. */
    PI: number;
    /** The square root of 0.5, or, equivalently, one divided by the square root of 2. */
    SQRT1_2: number;
    /** The square root of 2. */
    SQRT2: number;
    /**
      * Returns the absolute value of a number (the value without regard to whether it is positive or negative).
      * For example, the absolute value of -5 is the same as the absolute value of 5.
      * @param x A numeric expression for which the absolute value is needed.
      */
    abs(x: number): number;
    /**
      * Returns the arc cosine (or inverse cosine) of a number.
      * @param x A numeric expression.
      */
    acos(x: number): number;
    /**
      * Returns the arcsine of a number.
      * @param x A numeric expression.
      */
    asin(x: number): number;
    /**
      * Returns the arctangent of a number.
      * @param x A numeric expression for which the arctangent is needed.
      */
    atan(x: number): number;
    /**
      * Returns the angle (in radians) from the X axis to a point.
      * @param y A numeric expression representing the cartesian y-coordinate.
      * @param x A numeric expression representing the cartesian x-coordinate.
      */
    atan2(y: number, x: number): number;
    /**
      * Returns the smallest number greater than or equal to its numeric argument.
      * @param x A numeric expression.
      */
    ceil(x: number): number;
    /**
      * Returns the cosine of a number.
      * @param x A numeric expression that contains an angle measured in radians.
      */
    cos(x: number): number;
    /**
      * Returns e (the base of natural logarithms) raised to a power.
      * @param x A numeric expression representing the power of e.
      */
    exp(x: number): number;
    /**
      * Returns the greatest number less than or equal to its numeric argument.
      * @param x A numeric expression.
      */
    /*@ floor (x: number) : {number | x - 1 < v && v <= x} */
    floor(x: number): number;
    /**
      * Returns the natural logarithm (base e) of a number.
      * @param x A numeric expression.
      */
    log(x: number): number;
    /**
      * Returns the larger of a set of supplied numeric expressions.
      * @param values Numeric expressions to be evaluated.
      */
    /*@ max (a:number, b:number) : {number | v = if (a < b) then b else a} */
    max(a: number, b: number): number;
    // ORIG: max(...values: number[]): number;
    /**
      * Returns the smaller of a set of supplied numeric expressions.
      * @param values Numeric expressions to be evaluated.
      */
    /*@ min (a:number, b:number) : {number | v = if (a < b) then a else b} */
    min(...values: number[]): number;
    /**
      * Returns the value of a base expression taken to a specified power.
      * @param x The base value of the expression.
      * @param y The exponent value of the expression.
      */
    pow(x: number, y: number): number;
    /** Returns a pseudorandom number between 0 and 1. */
    random(): number;
    /**
      * Returns a supplied numeric expression rounded to the nearest number.
      * @param x The value to be rounded to the nearest number.
      */
    round(x: number): number;
    /**
      * Returns the sine of a number.
      * @param x A numeric expression that contains an angle measured in radians.
      */
    sin(x: number): number;
    /**
      * Returns the square root of a number.
      * @param x A numeric expression.
      */
    /*@ sqrt (x:{number | v >= 0}) : {number | v = 0 <=> x = 0} */
    sqrt(x: number): number;
    /**
      * Returns the tangent of a number.
      * @param x A numeric expression that contains an angle measured in radians.
      */
    tan(x: number): number;
}

/** An intrinsic object that provides basic mathematics functionality and constants. */
declare let Math: Math<Immutable>;
