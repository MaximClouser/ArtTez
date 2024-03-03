import smartpy as sp

tstorage = sp.record(last_received_balances = sp.list(sp.record(balance = sp.nat, request = sp.record(owner = sp.address, token_id = sp.nat).layout(("owner", "token_id"))).layout(("request", "balance")))).layout("last_received_balances")
tparameter = sp.variant(receive_balances = sp.list(sp.record(balance = sp.nat, request = sp.record(owner = sp.address, token_id = sp.nat).layout(("owner", "token_id"))).layout(("request", "balance")))).layout("receive_balances")
tprivates = { }
tviews = { }
