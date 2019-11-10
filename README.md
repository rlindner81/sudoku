# sudoku

## related links

* https://en.wikipedia.org/wiki/Mathematics_of_Sudoku
* https://codepen.io/pavlovsk/pen/XmjPOE
* https://github.com/norvig/pytudes/blob/master/py/sudoku.py
* http://www.sudokuwiki.org/sudoku.htm
* http://www.afjarvis.staff.shef.ac.uk/sudoku/
* https://sites.google.com/site/dobrichev/sudoku-puzzle-collections

Solver implementations
* Donald E. Knuth (Exact cover problem/Dancing links): 
  * https://www-cs-faculty.stanford.edu/~knuth/programs/sudoku.w
  * https://www-cs-faculty.stanford.edu/~knuth/programs.html
* Bram Cohen (SAT): https://bramcohen.livejournal.com/70250.html
* Peter Norvig (Brute force): http://www.norvig.com/sudoku.html

Node modules new syntaxes
* https://medium.com/@giltayar/native-es-modules-in-nodejs-status-and-future-directions-part-i-ee5ea3001f71
Actually working memwatch package
* https://www.npmjs.com/package/node-memwatch

## todo

* boxsize 2,4 generation
* Input popup
* Input with hover for Desktop
* Confetti for solving
* Helper get function codeing

## similar puzzles

* Latin Squares
  Grandfather of Sudoku
  https://en.wikipedia.org/wiki/Latin_square

* Killer Sudoku
  Cages with sums as hints
  Digits may not repeat within a cage
  https://en.wikipedia.org/wiki/Killer_sudoku

* KenKen
  Cages with numbers combined under addition/substraction/multiplication/division
  Digits may repeat within a cage
  https://en.wikipedia.org/wiki/KenKen

## timings

```
solver size 12 = 4x3 | hints 29
success | total 604ms | delta 604ms | call 1
success | total 4475ms | delta 3871ms | call 2
success | total 6261ms | delta 1786ms | call 3
success | total 6913ms | delta 652ms | call 4
success | total 10652ms | delta 3739ms | call 5
success | total 16470ms | delta 5818ms | call 6
success | total 33026ms | delta 16556ms | call 7
success | total 41034ms | delta 8008ms | call 8
success | total 44939ms | delta 3905ms | call 9
success | total 49216ms | delta 4277ms | call 10
success | total 49732ms | delta 516ms | call 11
success | total 57278ms | delta 7546ms | call 12
success | total 57759ms | delta 481ms | call 13
success | total 63149ms | delta 5390ms | call 14
success | total 67304ms | delta 4155ms | call 15
success | total 71711ms | delta 4407ms | call 16
success | total 84856ms | delta 13145ms | call 17
success | total 89667ms | delta 4811ms | call 18
success | total 90671ms | delta 1004ms | call 19
success | total 104225ms | delta 13554ms | call 20
solver size 14 = 7x2 | hints 40
success | total 118062ms | delta 13837ms | call 21
success | total 133309ms | delta 15247ms | call 22
success | total 152957ms | delta 19648ms | call 23
success | total 154717ms | delta 1760ms | call 24
success | total 157914ms | delta 3197ms | call 25
success | total 173945ms | delta 16031ms | call 26
success | total 195684ms | delta 21739ms | call 27
success | total 208481ms | delta 12797ms | call 28
success | total 209746ms | delta 1265ms | call 29
success | total 211653ms | delta 1907ms | call 30
success | total 224224ms | delta 12571ms | call 31
success | total 232602ms | delta 8378ms | call 32
success | total 277873ms | delta 45271ms | call 33
success | total 301453ms | delta 23580ms | call 34
success | total 324925ms | delta 23472ms | call 35
success | total 335826ms | delta 10901ms | call 36
success | total 339286ms | delta 3460ms | call 37
success | total 382409ms | delta 43123ms | call 38
success | total 428978ms | delta 46569ms | call 39
success | total 431097ms | delta 2119ms | call 40
solver size 15 = 5x3 | hints 45
success | total 440508ms | delta 9411ms | call 41
success | total 459143ms | delta 18635ms | call 42
success | total 476046ms | delta 16903ms | call 43
success | total 532629ms | delta 56583ms | call 44
success | total 628495ms | delta 95866ms | call 45
success | total 674133ms | delta 45638ms | call 46
success | total 711182ms | delta 37049ms | call 47
success | total 729549ms | delta 18367ms | call 48
success | total 761829ms | delta 32280ms | call 49
success | total 784289ms | delta 22460ms | call 50
success | total 814299ms | delta 30010ms | call 51
success | total 817435ms | delta 3136ms | call 52
success | total 832413ms | delta 14978ms | call 53
success | total 835723ms | delta 3310ms | call 54
success | total 880662ms | delta 44939ms | call 55
success | total 909303ms | delta 28641ms | call 56
success | total 933444ms | delta 24141ms | call 57
success | total 951068ms | delta 17624ms | call 58
success | total 970147ms | delta 19079ms | call 59
success | total 993314ms | delta 23167ms | call 60
solver size 16 = 4x4 | hints 52
success | total 1006408ms | delta 13094ms | call 61
success | total 1043746ms | delta 37338ms | call 62
success | total 1114489ms | delta 70743ms | call 63
success | total 1118662ms | delta 4173ms | call 64
success | total 1130674ms | delta 12012ms | call 65
success | total 1151162ms | delta 20488ms | call 66
success | total 1170869ms | delta 19707ms | call 67
success | total 1217370ms | delta 46501ms | call 68
success | total 1238131ms | delta 20761ms | call 69
success | total 1244372ms | delta 6241ms | call 70
success | total 1248322ms | delta 3950ms | call 71
success | total 1273122ms | delta 24800ms | call 72
success | total 1285107ms | delta 11985ms | call 73
success | total 1291470ms | delta 6363ms | call 74
success | total 1347177ms | delta 55707ms | call 75
success | total 1370419ms | delta 23242ms | call 76
success | total 1422326ms | delta 51907ms | call 77
success | total 1468093ms | delta 45767ms | call 78
success | total 1487273ms | delta 19180ms | call 79
success | total 1508516ms | delta 21243ms | call 80
solver size 18 = 6x3 | hints 65
success | total 1532688ms | delta 24172ms | call 81
success | total 1594827ms | delta 62139ms | call 82
success | total 1677434ms | delta 82607ms | call 83
success | total 1715828ms | delta 38394ms | call 84
success | total 1816885ms | delta 101057ms | call 85
success | total 1879553ms | delta 62668ms | call 86
success | total 1929259ms | delta 49706ms | call 87
success | total 1934565ms | delta 5306ms | call 88
success | total 1978618ms | delta 44053ms | call 89
success | total 1996386ms | delta 17768ms | call 90
success | total 2042020ms | delta 45634ms | call 91
success | total 2048938ms | delta 6918ms | call 92
success | total 2068521ms | delta 19583ms | call 93
success | total 2102071ms | delta 33550ms | call 94
success | total 2183370ms | delta 81299ms | call 95
success | total 2229453ms | delta 46083ms | call 96
success | total 2365491ms | delta 136038ms | call 97
success | total 2612084ms | delta 246593ms | call 98
success | total 2620581ms | delta 8497ms | call 99
success | total 2728694ms | delta 108113ms | call 100
solver size 20 = 5x4 | hints 80
success | total 2848103ms | delta 119409ms | call 101
success | total 3020886ms | delta 172783ms | call 102
success | total 3051522ms | delta 30636ms | call 103
success | total 3066454ms | delta 14932ms | call 104
success | total 3205338ms | delta 138884ms | call 105
success | total 3512711ms | delta 307373ms | call 106
success | total 3645148ms | delta 132437ms | call 107
success | total 3767554ms | delta 122406ms | call 108
success | total 3951461ms | delta 183907ms | call 109
success | total 3997701ms | delta 46240ms | call 110
success | total 4028045ms | delta 30344ms | call 111
success | total 4255366ms | delta 227321ms | call 112
success | total 4306849ms | delta 51483ms | call 113
success | total 4337745ms | delta 30896ms | call 114
success | total 4419921ms | delta 82176ms | call 115
success | total 4452188ms | delta 32267ms | call 116
success | total 4620179ms | delta 167991ms | call 117
success | total 4895119ms | delta 274940ms | call 118
success | total 5002604ms | delta 107485ms | call 119
success | total 5030133ms | delta 27529ms | call 120
solver size 21 = 7x3 | hints 89
success | total 5310405ms | delta 280272ms | call 121
success | total 5681826ms | delta 371421ms | call 122
success | total 5806400ms | delta 124574ms | call 123
success | total 6514927ms | delta 708527ms | call 124
success | total 6785566ms | delta 270639ms | call 125
success | total 6800706ms | delta 15140ms | call 126
success | total 7085737ms | delta 285031ms | call 127
success | total 7213006ms | delta 127269ms | call 128
success | total 7230204ms | delta 17198ms | call 129
success | total 7506134ms | delta 275930ms | call 130
success | total 7698758ms | delta 192624ms | call 131
success | total 7929534ms | delta 230776ms | call 132
success | total 8584584ms | delta 655050ms | call 133
success | total 8796439ms | delta 211855ms | call 134
success | total 8834326ms | delta 37887ms | call 135
success | total 9549067ms | delta 714741ms | call 136
success | total 9708443ms | delta 159376ms | call 137
success | total 10058870ms | delta 350427ms | call 138
success | total 10175408ms | delta 116538ms | call 139
success | total 10488182ms | delta 312774ms | call 140
solver size 22 = 11x2 | hints 97
success | total 12609170ms | delta 2120988ms | call 141
success | total 13934169ms | delta 1324999ms | call 142
success | total 16706636ms | delta 2772467ms | call 143
success | total 17667541ms | delta 960905ms | call 144
success | total 18142312ms | delta 474771ms | call 145
success | total 19376368ms | delta 1234056ms | call 146
success | total 21346452ms | delta 1970084ms | call 147
success | total 22520760ms | delta 1174308ms | call 148
success | total 23889239ms | delta 1368479ms | call 149
success | total 24095993ms | delta 206754ms | call 150
success | total 26013394ms | delta 1917401ms | call 151
success | total 26108994ms | delta 95600ms | call 152
success | total 27950694ms | delta 1841700ms | call 153
success | total 29020728ms | delta 1070034ms | call 154
success | total 30277762ms | delta 1257034ms | call 155
success | total 31722503ms | delta 1444741ms | call 156
success | total 38810460ms | delta 7087957ms | call 157
success | total 39239440ms | delta 428980ms | call 158
success | total 39680642ms | delta 441202ms | call 159
success | total 40290953ms | delta 610311ms | call 160
solver size 24 = 6x4 | hints 116
root@v37544:~/sudoku# cat solver-timings.txt
(node:3885) ExperimentalWarning: The ESM module loader is experimental.
solver size 12 = 4x3 | hints 29
success | total 604ms | delta 604ms | call 1
success | total 4475ms | delta 3871ms | call 2
success | total 6261ms | delta 1786ms | call 3
success | total 6913ms | delta 652ms | call 4
success | total 10652ms | delta 3739ms | call 5
success | total 16470ms | delta 5818ms | call 6
success | total 33026ms | delta 16556ms | call 7
success | total 41034ms | delta 8008ms | call 8
success | total 44939ms | delta 3905ms | call 9
success | total 49216ms | delta 4277ms | call 10
success | total 49732ms | delta 516ms | call 11
success | total 57278ms | delta 7546ms | call 12
success | total 57759ms | delta 481ms | call 13
success | total 63149ms | delta 5390ms | call 14
success | total 67304ms | delta 4155ms | call 15
success | total 71711ms | delta 4407ms | call 16
success | total 84856ms | delta 13145ms | call 17
success | total 89667ms | delta 4811ms | call 18
success | total 90671ms | delta 1004ms | call 19
success | total 104225ms | delta 13554ms | call 20
solver size 14 = 7x2 | hints 40
success | total 118062ms | delta 13837ms | call 21
success | total 133309ms | delta 15247ms | call 22
success | total 152957ms | delta 19648ms | call 23
success | total 154717ms | delta 1760ms | call 24
success | total 157914ms | delta 3197ms | call 25
success | total 173945ms | delta 16031ms | call 26
success | total 195684ms | delta 21739ms | call 27
success | total 208481ms | delta 12797ms | call 28
success | total 209746ms | delta 1265ms | call 29
success | total 211653ms | delta 1907ms | call 30
success | total 224224ms | delta 12571ms | call 31
success | total 232602ms | delta 8378ms | call 32
success | total 277873ms | delta 45271ms | call 33
success | total 301453ms | delta 23580ms | call 34
success | total 324925ms | delta 23472ms | call 35
success | total 335826ms | delta 10901ms | call 36
success | total 339286ms | delta 3460ms | call 37
success | total 382409ms | delta 43123ms | call 38
success | total 428978ms | delta 46569ms | call 39
success | total 431097ms | delta 2119ms | call 40
solver size 15 = 5x3 | hints 45
success | total 440508ms | delta 9411ms | call 41
success | total 459143ms | delta 18635ms | call 42
success | total 476046ms | delta 16903ms | call 43
success | total 532629ms | delta 56583ms | call 44
success | total 628495ms | delta 95866ms | call 45
success | total 674133ms | delta 45638ms | call 46
success | total 711182ms | delta 37049ms | call 47
success | total 729549ms | delta 18367ms | call 48
success | total 761829ms | delta 32280ms | call 49
success | total 784289ms | delta 22460ms | call 50
success | total 814299ms | delta 30010ms | call 51
success | total 817435ms | delta 3136ms | call 52
success | total 832413ms | delta 14978ms | call 53
success | total 835723ms | delta 3310ms | call 54
success | total 880662ms | delta 44939ms | call 55
success | total 909303ms | delta 28641ms | call 56
success | total 933444ms | delta 24141ms | call 57
success | total 951068ms | delta 17624ms | call 58
success | total 970147ms | delta 19079ms | call 59
success | total 993314ms | delta 23167ms | call 60
solver size 16 = 4x4 | hints 52
success | total 1006408ms | delta 13094ms | call 61
success | total 1043746ms | delta 37338ms | call 62
success | total 1114489ms | delta 70743ms | call 63
success | total 1118662ms | delta 4173ms | call 64
success | total 1130674ms | delta 12012ms | call 65
success | total 1151162ms | delta 20488ms | call 66
success | total 1170869ms | delta 19707ms | call 67
success | total 1217370ms | delta 46501ms | call 68
success | total 1238131ms | delta 20761ms | call 69
success | total 1244372ms | delta 6241ms | call 70
success | total 1248322ms | delta 3950ms | call 71
success | total 1273122ms | delta 24800ms | call 72
success | total 1285107ms | delta 11985ms | call 73
success | total 1291470ms | delta 6363ms | call 74
success | total 1347177ms | delta 55707ms | call 75
success | total 1370419ms | delta 23242ms | call 76
success | total 1422326ms | delta 51907ms | call 77
success | total 1468093ms | delta 45767ms | call 78
success | total 1487273ms | delta 19180ms | call 79
success | total 1508516ms | delta 21243ms | call 80
solver size 18 = 6x3 | hints 65
success | total 1532688ms | delta 24172ms | call 81
success | total 1594827ms | delta 62139ms | call 82
success | total 1677434ms | delta 82607ms | call 83
success | total 1715828ms | delta 38394ms | call 84
success | total 1816885ms | delta 101057ms | call 85
success | total 1879553ms | delta 62668ms | call 86
success | total 1929259ms | delta 49706ms | call 87
success | total 1934565ms | delta 5306ms | call 88
success | total 1978618ms | delta 44053ms | call 89
success | total 1996386ms | delta 17768ms | call 90
success | total 2042020ms | delta 45634ms | call 91
success | total 2048938ms | delta 6918ms | call 92
success | total 2068521ms | delta 19583ms | call 93
success | total 2102071ms | delta 33550ms | call 94
success | total 2183370ms | delta 81299ms | call 95
success | total 2229453ms | delta 46083ms | call 96
success | total 2365491ms | delta 136038ms | call 97
success | total 2612084ms | delta 246593ms | call 98
success | total 2620581ms | delta 8497ms | call 99
success | total 2728694ms | delta 108113ms | call 100
solver size 20 = 5x4 | hints 80
success | total 2848103ms | delta 119409ms | call 101
success | total 3020886ms | delta 172783ms | call 102
success | total 3051522ms | delta 30636ms | call 103
success | total 3066454ms | delta 14932ms | call 104
success | total 3205338ms | delta 138884ms | call 105
success | total 3512711ms | delta 307373ms | call 106
success | total 3645148ms | delta 132437ms | call 107
success | total 3767554ms | delta 122406ms | call 108
success | total 3951461ms | delta 183907ms | call 109
success | total 3997701ms | delta 46240ms | call 110
success | total 4028045ms | delta 30344ms | call 111
success | total 4255366ms | delta 227321ms | call 112
success | total 4306849ms | delta 51483ms | call 113
success | total 4337745ms | delta 30896ms | call 114
success | total 4419921ms | delta 82176ms | call 115
success | total 4452188ms | delta 32267ms | call 116
success | total 4620179ms | delta 167991ms | call 117
success | total 4895119ms | delta 274940ms | call 118
success | total 5002604ms | delta 107485ms | call 119
success | total 5030133ms | delta 27529ms | call 120
solver size 21 = 7x3 | hints 89
success | total 5310405ms | delta 280272ms | call 121
success | total 5681826ms | delta 371421ms | call 122
success | total 5806400ms | delta 124574ms | call 123
success | total 6514927ms | delta 708527ms | call 124
success | total 6785566ms | delta 270639ms | call 125
success | total 6800706ms | delta 15140ms | call 126
success | total 7085737ms | delta 285031ms | call 127
success | total 7213006ms | delta 127269ms | call 128
success | total 7230204ms | delta 17198ms | call 129
success | total 7506134ms | delta 275930ms | call 130
success | total 7698758ms | delta 192624ms | call 131
success | total 7929534ms | delta 230776ms | call 132
success | total 8584584ms | delta 655050ms | call 133
success | total 8796439ms | delta 211855ms | call 134
success | total 8834326ms | delta 37887ms | call 135
success | total 9549067ms | delta 714741ms | call 136
success | total 9708443ms | delta 159376ms | call 137
success | total 10058870ms | delta 350427ms | call 138
success | total 10175408ms | delta 116538ms | call 139
success | total 10488182ms | delta 312774ms | call 140
solver size 22 = 11x2 | hints 97
success | total 12609170ms | delta 2120988ms | call 141
success | total 13934169ms | delta 1324999ms | call 142
success | total 16706636ms | delta 2772467ms | call 143
success | total 17667541ms | delta 960905ms | call 144
success | total 18142312ms | delta 474771ms | call 145
success | total 19376368ms | delta 1234056ms | call 146
success | total 21346452ms | delta 1970084ms | call 147
success | total 22520760ms | delta 1174308ms | call 148
success | total 23889239ms | delta 1368479ms | call 149
success | total 24095993ms | delta 206754ms | call 150
success | total 26013394ms | delta 1917401ms | call 151
success | total 26108994ms | delta 95600ms | call 152
success | total 27950694ms | delta 1841700ms | call 153
success | total 29020728ms | delta 1070034ms | call 154
success | total 30277762ms | delta 1257034ms | call 155
success | total 31722503ms | delta 1444741ms | call 156
success | total 38810460ms | delta 7087957ms | call 157
success | total 39239440ms | delta 428980ms | call 158
success | total 39680642ms | delta 441202ms | call 159
success | total 40290953ms | delta 610311ms | call 160
solver size 24 = 6x4 | hints 116
success | total 1.1 day | delta 1.1 day | call 1
success | total 1.2 day | delta 1.7 hour | call 2
success | total 1.2 day | delta 1.4 hour | call 3
```
