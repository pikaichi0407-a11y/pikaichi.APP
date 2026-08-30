"""
ローポリ「魚を持った釣り人」ジェネレーター for Blender
================================================================
写真（磯で釣ったシイラ／マヒマヒを掲げる釣り人）をモチーフにした
ローポリキャラクターを bpy で自動生成し、.glb に書き出します。

■ 使い方（あなたのPCのBlenderで）
  1. Blenderを開く
  2. 上部タブ「Scripting」を開く
  3. 「テキスト」→「開く」でこの fisherman.py を選択
     （またはこの中身を貼り付け）
  4. ▶（スクリプト実行 / Alt+P）を押す
  5. ビューポートに釣り人＋魚が生成され、
     assets/models/character1.glb に書き出されます

■ 出力先を変えたい場合
  一番下の EXPORT_PATH を書き換えてください。
  空文字 "" にすると書き出しをスキップし、ビューポート生成のみになります。
"""

import bpy
import math
import os
import sys

# ----------------------------------------------------------------------
# 設定
# ----------------------------------------------------------------------
# .glb の書き出し先（このリポジトリの assets/models/ を想定）。
# 例: "C:/Users/you/pikaichi.APP/assets/models/character1.glb"
# 空にすると書き出しをスキップします。
#
# コマンドラインから上書きも可能:
#   blender --python fisherman.py -- --out C:\path\character1.glb
EXPORT_PATH = "//character1.glb"  # //=.blend と同じ場所。適宜フルパスに変更可


def resolve_export_path():
    """`--` 以降の --out 引数があればそれを優先して使う"""
    argv = sys.argv
    if "--" in argv:
        extra = argv[argv.index("--") + 1:]
        if "--out" in extra:
            idx = extra.index("--out") + 1
            if idx < len(extra):
                path = os.path.abspath(extra[idx])
                os.makedirs(os.path.dirname(path), exist_ok=True)
                return path
    return EXPORT_PATH

# ----------------------------------------------------------------------
# ユーティリティ
# ----------------------------------------------------------------------

def clear_scene():
    """既存オブジェクト・マテリアルを全消去"""
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in (bpy.data.meshes, bpy.data.materials, bpy.data.armatures):
        for item in list(block):
            block.remove(item)


def add_lighting():
    """ビューポートのレンダープレビュー用に太陽光を1つ置く（曇天の磯イメージ）"""
    bpy.ops.object.light_add(type="SUN", location=(4, -6, 8))
    sun = bpy.context.active_object
    sun.name = "KeyLight"
    sun.data.energy = 3.0
    sun.rotation_euler = (math.radians(50), 0, math.radians(35))
    return sun


def make_material(name, color, metallic=0.0, roughness=0.6):
    """単色マテリアルを作成（color = (r,g,b) 0-1）"""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


def add_shape(kind, name, location, scale=(1, 1, 1), rotation=(0, 0, 0),
              material=None, **kw):
    """プリミティブを1つ追加して返す"""
    if kind == "cube":
        bpy.ops.mesh.primitive_cube_add(location=location, size=1.0)
    elif kind == "sphere":
        bpy.ops.mesh.primitive_uv_sphere_add(location=location, segments=16,
                                             ring_count=8, radius=0.5)
    elif kind == "cylinder":
        bpy.ops.mesh.primitive_cylinder_add(location=location, vertices=16,
                                            radius=0.5, depth=1.0)
    elif kind == "cone":
        bpy.ops.mesh.primitive_cone_add(location=location, vertices=16,
                                        radius1=0.5, radius2=0.0, depth=1.0)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = scale
    obj.rotation_euler = rotation
    if material:
        obj.data.materials.append(material)
    return obj


# ----------------------------------------------------------------------
# マテリアル
# ----------------------------------------------------------------------

def build_materials():
    return {
        "skin":  make_material("Skin",  (0.85, 0.68, 0.55), roughness=0.7),
        "cloth": make_material("Cloth", (0.55, 0.57, 0.62), roughness=0.8),  # グレーのウェア
        "vest":  make_material("Vest",  (0.10, 0.11, 0.13), roughness=0.7),  # 黒ライフベスト
        "pants": make_material("Pants", (0.55, 0.62, 0.48), roughness=0.85), # カーキパンツ
        "cap":   make_material("Cap",   (0.08, 0.08, 0.10), roughness=0.6),
        "shoe":  make_material("Shoe",  (0.12, 0.12, 0.14), roughness=0.6),
        "glove": make_material("Glove", (0.05, 0.05, 0.06), roughness=0.7),
        "rod":   make_material("Rod",   (0.06, 0.06, 0.06), metallic=0.3, roughness=0.4),
        # シイラ（マヒマヒ）: 緑〜黄のグラデ感を単色で寄せる
        "fish_body": make_material("FishBody", (0.35, 0.75, 0.30), metallic=0.2, roughness=0.35),
        "fish_belly": make_material("FishBelly", (0.95, 0.85, 0.20), metallic=0.2, roughness=0.35),
        "fish_head": make_material("FishHead", (0.90, 0.80, 0.15), metallic=0.2, roughness=0.35),
        "lure":  make_material("Lure",  (0.95, 0.20, 0.55), metallic=0.5, roughness=0.2), # ピンクのルアー
    }


# ----------------------------------------------------------------------
# パーツ生成
# ----------------------------------------------------------------------

def build_person(m):
    parts = []
    # 胴体（ライフベストを着た上半身）
    parts.append(add_shape("cube", "Torso", (0, 0, 1.05),
                           scale=(0.5, 0.28, 0.7), material=m["vest"]))
    # 腰・パンツ
    parts.append(add_shape("cube", "Hips", (0, 0, 0.62),
                           scale=(0.46, 0.27, 0.28), material=m["pants"]))
    # 首
    parts.append(add_shape("cylinder", "Neck", (0, 0, 1.5),
                           scale=(0.12, 0.12, 0.18), material=m["skin"]))
    # 頭
    head = add_shape("sphere", "Head", (0, 0, 1.72),
                     scale=(0.26, 0.28, 0.30), material=m["skin"])
    parts.append(head)
    # キャップ（つば付き帽子）
    parts.append(add_shape("sphere", "CapCrown", (0, 0.02, 1.82),
                           scale=(0.28, 0.29, 0.20), material=m["cap"]))
    parts.append(add_shape("cube", "CapBrim", (0, -0.28, 1.74),
                           scale=(0.24, 0.16, 0.02), material=m["cap"]))

    # 脚（2本）
    for side, x in (("L", 0.20), ("R", -0.20)):
        parts.append(add_shape("cylinder", f"Leg_{side}", (x, 0, 0.22),
                               scale=(0.14, 0.14, 0.55), material=m["pants"]))
        parts.append(add_shape("cube", f"Shoe_{side}", (x, -0.10, -0.05),
                               scale=(0.13, 0.24, 0.08), material=m["shoe"]))

    # 左腕（体の横に下ろす）— 画面向かって右手側、魚に添える
    parts.append(add_shape("cylinder", "Arm_L_upper", (0.60, 0, 1.15),
                           scale=(0.10, 0.10, 0.42),
                           rotation=(0, math.radians(20), 0), material=m["cloth"]))
    parts.append(add_shape("cylinder", "Arm_L_fore", (0.78, 0, 0.72),
                           scale=(0.09, 0.09, 0.38),
                           rotation=(0, math.radians(10), 0), material=m["cloth"]))
    parts.append(add_shape("sphere", "Hand_L", (0.82, 0, 0.42),
                           scale=(0.12, 0.12, 0.12), material=m["glove"]))

    # 右腕（高く上げて魚＆ロッドを掲げる）
    parts.append(add_shape("cylinder", "Arm_R_upper", (-0.55, 0, 1.35),
                           scale=(0.10, 0.10, 0.42),
                           rotation=(0, math.radians(-55), 0), material=m["cloth"]))
    parts.append(add_shape("cylinder", "Arm_R_fore", (-0.95, 0, 1.85),
                           scale=(0.09, 0.09, 0.40),
                           rotation=(0, math.radians(-30), 0), material=m["cloth"]))
    hand_r = add_shape("sphere", "Hand_R", (-1.05, 0, 2.20),
                       scale=(0.12, 0.12, 0.12), material=m["glove"])
    parts.append(hand_r)
    return parts, hand_r


def build_fish(m):
    """掲げられた魚（シイラ）。右手の下あたりに縦向きで吊るす"""
    parts = []
    # 本体（紡錘形）
    body = add_shape("sphere", "Fish_Body", (-0.55, 0, 1.35),
                     scale=(0.22, 0.16, 0.62), material=m["fish_body"])
    parts.append(body)
    # 腹側の黄色
    parts.append(add_shape("sphere", "Fish_Belly", (-0.42, 0, 1.30),
                           scale=(0.12, 0.14, 0.55), material=m["fish_belly"]))
    # 頭（シイラ特有の角張った額）
    parts.append(add_shape("cube", "Fish_Head", (-0.60, 0, 1.92),
                           scale=(0.20, 0.14, 0.16), material=m["fish_head"]))
    # 尾びれ
    parts.append(add_shape("cone", "Fish_Tail", (-0.52, 0, 0.62),
                           scale=(0.30, 0.02, 0.28),
                           rotation=(math.radians(180), 0, 0), material=m["fish_body"]))
    # 背びれ（長い）
    parts.append(add_shape("cube", "Fish_DorsalFin", (-0.72, 0, 1.45),
                           scale=(0.02, 0.10, 0.55), material=m["fish_body"]))
    # 胸びれ
    parts.append(add_shape("cube", "Fish_Fin", (-0.40, 0.12, 1.40),
                           scale=(0.12, 0.02, 0.10),
                           rotation=(0, 0, math.radians(20)), material=m["fish_belly"]))
    # 口に刺さったピンクのルアー
    parts.append(add_shape("cylinder", "Lure", (-0.60, -0.10, 2.05),
                           scale=(0.04, 0.04, 0.14),
                           rotation=(math.radians(60), 0, 0), material=m["lure"]))
    return parts


def build_rod(m):
    """釣り竿（右手からのびる）"""
    return [add_shape("cylinder", "Rod", (-0.30, 0.55, 1.55),
                      scale=(0.02, 0.02, 1.3),
                      rotation=(math.radians(60), 0, math.radians(10)),
                      material=m["rod"])]


# ----------------------------------------------------------------------
# 仕上げ
# ----------------------------------------------------------------------

def join_all(name="character"):
    """全メッシュを1つに結合してエクスポートしやすくする"""
    bpy.ops.object.select_all(action="SELECT")
    meshes = [o for o in bpy.context.selected_objects if o.type == "MESH"]
    if not meshes:
        return None
    bpy.context.view_layer.objects.active = meshes[0]
    bpy.ops.object.join()
    obj = bpy.context.active_object
    obj.name = name
    # 原点を底に寄せ、地面(z=0)に立たせる
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    obj.location = (0, 0, 0)
    return obj


def export_glb(path, obj):
    """指定メッシュだけを .glb に書き出す（ライトは含めない）"""
    if not path:
        print("EXPORT_PATH が空のため書き出しをスキップしました。")
        return
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.export_scene.gltf(
        filepath=path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,   # モディファイア/スケールを適用
    )
    print(f"✅ 書き出し完了: {path}")


# ----------------------------------------------------------------------
# メイン
# ----------------------------------------------------------------------

def main():
    clear_scene()
    m = build_materials()
    build_person(m)
    build_fish(m)
    build_rod(m)
    character = join_all("character")
    add_lighting()
    export_glb(resolve_export_path(), character)
    print("🎣 釣り人モデル生成完了！")


if __name__ == "__main__":
    main()
