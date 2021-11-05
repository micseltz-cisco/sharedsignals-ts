# Copyright (c) 2021 Cisco Systems, Inc. and its affiliates
# All rights reserved.
# Use of this source code is governed by a BSD 3-Clause License
# that can be found in the LICENSE file.

from typing import Dict, Any, Tuple, Union, List

import connexion

from swagger_server import business_logic
from swagger_server.models import RegisterParameters


def register() -> Tuple[Dict[str, str], int]:
    body = RegisterParameters.parse_obj(connexion.request.get_json())

    aud: Union[str, List[str]] = []
    if body.audience is not None:
        aud = body.audience

    token_json = business_logic.register(aud)
    return token_json, 200
